-- ============================================================================
-- SCRIPT PARA SUPABASE SQL EDITOR
-- Clonar todos los regalos activos de un evento a otro evento
-- ============================================================================
-- Evento Origen (copiar):  cmr83ae20000004l1aeloqz8m
-- Evento Destino (pegar):  cmtxy7yew000004kzvrwxuvz6
-- ============================================================================

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
    -- Genera un ID compatible tipo cuid (25 caracteres iniciando con 'c')
    'c' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 24) AS "id",
    'cmtxy7yew000004kzvrwxuvz6' AS "eventId",
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
    -- En el nuevo evento el estado vuelve a estar disponible
    'AVAILABLE'::public."GiftStatus" AS "status",
    -- Si el evento destino ya tenía regalos, continúa la correlación de posiciones
    g."position" + COALESCE((
        SELECT MAX("position") + 1 
        FROM public."Gift" 
        WHERE "eventId" = 'cmtxy7yew000004kzvrwxuvz6' 
          AND "deletedAt" IS NULL
    ), 0) AS "position",
    -- Resetea métricas de compra para el nuevo evento
    NULL AS "purchasedAt",
    NULL AS "deletedAt",
    NOW() AS "createdAt",
    NOW() AS "updatedAt",
    0 AS "purchasedQuantity",
    g."quantity"
FROM public."Gift" g
WHERE g."eventId" = 'cmr83ae20000004l1aeloqz8m'
  AND g."deletedAt" IS NULL
ORDER BY g."position" ASC
RETURNING 
    "id", 
    "name", 
    "price", 
    "currency", 
    "quantity", 
    "position", 
    "status";
