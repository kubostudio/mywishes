import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Usar .env por defecto (donde está Supabase remoto con los eventos)
// o .env.local si se pasa la bandera --local
const useLocal = process.argv.includes("--local");
config({ path: useLocal ? ".env.local" : ".env", override: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("No se encontró DATABASE_URL en el archivo de entorno.");
}

const adapter = new PrismaPg({
    connectionString: databaseUrl,
});
const prisma = new PrismaClient({ adapter });


async function main() {
    const cleanArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
    const sourceEventId = cleanArgs[0] || "cmr83ae20000004l1aeloqz8m";
    const targetEventId = cleanArgs[1] || "cmtxy7yew000004kzvrwxuvz6";

    console.log("==========================================");
    console.log("CLONADOR DE REGALOS ENTRE EVENTOS");
    console.log("==========================================");
    console.log(`Base de datos:           ${useLocal ? "Local (.env.local)" : "Supabase Remoto (.env)"}`);
    console.log(`Evento Origen (copiar):  ${sourceEventId}`);
    console.log(`Evento Destino (pegar):  ${targetEventId}`);
    console.log("------------------------------------------");

    // 1. Validar evento origen y destino usando select explícito (evita fallos por columnas no migradas como template)
    const sourceEvent = await prisma.event.findUnique({
        where: { id: sourceEventId },
        select: { id: true, name: true },
    });

    if (!sourceEvent) {
        throw new Error(`Evento origen con ID "${sourceEventId}" no existe en la base de datos.`);
    }

    const targetEvent = await prisma.event.findUnique({
        where: { id: targetEventId },
        select: { id: true, name: true },
    });

    if (!targetEvent) {
        throw new Error(`Evento destino con ID "${targetEventId}" no existe en la base de datos.`);
    }

    // 2. Obtener regalos activos del evento origen
    const sourceGifts = await prisma.gift.findMany({
        where: {
            eventId: sourceEventId,
            deletedAt: null,
        },
        orderBy: { position: "asc" },
    });

    console.log(`Evento origen:  "${sourceEvent.name}" (${sourceGifts.length} regalos activos)`);
    console.log(`Evento destino: "${targetEvent.name}"`);

    if (sourceGifts.length === 0) {
        console.log("No hay regalos activos en el evento origen para clonar.");
        return;
    }

    // 3. Obtener la última posición en el evento destino
    const lastGift = await prisma.gift.findFirst({
        where: {
            eventId: targetEventId,
            deletedAt: null,
        },
        orderBy: { position: "desc" },
        select: { position: true },
    });

    const currentMaxPosition = lastGift?.position ?? -1;
    const startPosition = currentMaxPosition + 1;

    console.log(`Iniciando copia de ${sourceGifts.length} regalos...`);

    // 4. Clonar los regalos de forma atómica y ultrarrápida en una sola operación
    const insertedCount = await prisma.$executeRaw`
        INSERT INTO public."Gift" (
            "id",
            "eventId",
            "name",
            "imageUrl",
            "brand",
            "price",
            "currency",
            "description",
            "color",
            "size",
            "dimensions",
            "originalUrl",
            "status",
            "position",
            "purchasedAt",
            "deletedAt",
            "createdAt",
            "updatedAt",
            "purchasedQuantity",
            "quantity"
        )
        SELECT
            'c' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 24) AS "id",
            ${targetEventId} AS "eventId",
            g."name",
            g."imageUrl",
            g."brand",
            g."price",
            g."currency",
            g."description",
            g."color",
            g."size",
            g."dimensions",
            g."originalUrl",
            'AVAILABLE'::public."GiftStatus" AS "status",
            g."position" + ${startPosition} AS "position",
            NULL AS "purchasedAt",
            NULL AS "deletedAt",
            NOW() AS "createdAt",
            NOW() AS "updatedAt",
            0 AS "purchasedQuantity",
            g."quantity"
        FROM public."Gift" g
        WHERE g."eventId" = ${sourceEventId}
          AND g."deletedAt" IS NULL
        ORDER BY g."position" ASC;
    `;

    console.log(`\n¡Éxito! Se clonaron ${insertedCount} regalos al nuevo evento.`);

    // 5. Listar los regalos clonados en el evento destino
    const clonedGifts = await prisma.gift.findMany({
        where: {
            eventId: targetEventId,
            deletedAt: null,
        },
        orderBy: { position: "asc" },
        select: {
            id: true,
            name: true,
            quantity: true,
            position: true,
            price: true,
            currency: true,
        },
    });

    clonedGifts.forEach((g, i) => {
        const priceStr = g.price ? ` | ${g.currency} ${g.price}` : "";
        console.log(`  ${i + 1}. [${g.id}] ${g.name} (Cant: ${g.quantity}${priceStr})`);
    });
}

main()
    .catch((error) => {
        console.error("\nError ejecutando clonación:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
