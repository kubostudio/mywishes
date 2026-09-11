"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";

import { reorderGiftsAction } from "@/features/gifts/actions/reorder-gifts-action";
import { GiftCard } from "@/features/gifts/components/gift-card";
import { type PageSizeOption, StoryPagination } from "@/components/storybook/story-pagination";

type SortableGift = {
    id: string;
    eventId: string;
    name: string;
    imageUrl: string | null;
    brand: string | null;
    price: string | null;
    currency: string;
    description: string | null;
    color: string | null;
    size: string | null;
    dimensions: string | null;
    originalUrl: string | null;
    status: "AVAILABLE" | "PURCHASED";
    quantity: number;
    purchasedQuantity: number;
};

type SortableGiftListProps = {
    eventId: string;
    gifts: SortableGift[];
};

function SortableGiftItem({ gift }: { gift: SortableGift }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: gift.id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={isDragging ? "opacity-60" : undefined}
        >
            <div className="mb-3 flex justify-end">
                <button
                    type="button"
                    className="inline-flex h-9 cursor-grab items-center rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-xs font-black text-[#5A371C] active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="mr-1 size-4" />
                    Arrastrar
                </button>
            </div>

            <GiftCard gift={gift} />
        </div>
    );
}

export function SortableGiftList({ eventId, gifts }: SortableGiftListProps) {
    const listTopRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [items, setItems] = useState(gifts);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSizeOption>(6);
    const [isPending, startTransition] = useTransition();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setItems(gifts);
    }, [gifts]);

    const effectivePageSize = pageSize === "all" ? (items.length || 1) : pageSize;
    const totalPages = Math.ceil(items.length / effectivePageSize) || 1;
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (validCurrentPage - 1) * effectivePageSize;
    const currentItems =
        pageSize === "all"
            ? items
            : items.slice(startIndex, startIndex + effectivePageSize);
    const showPagination = items.length > 3;

    function handlePageChange(page: number) {
        setCurrentPage(page);
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handlePageSizeChange(newSize: PageSizeOption) {
        setPageSize(newSize);
        setCurrentPage(1);
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const nextItems = arrayMove(items, oldIndex, newIndex);
        setItems(nextItems);

        startTransition(async () => {
            const result = await reorderGiftsAction(
                eventId,
                nextItems.map((item) => item.id)
            );

            if (!result.success) {
                toast.error(result.message);
                setItems(items);
                return;
            }

            toast.success(result.message);
        });
    }

    if (!mounted) {
        return (
            <div ref={listTopRef} className="scroll-mt-6">
                {showPagination ? (
                    <StoryPagination
                        className="mb-6"
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={items.length}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        itemLabel="regalos"
                    />
                ) : null}

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {currentItems.map((gift) => (
                        <GiftCard key={gift.id} gift={gift} />
                    ))}
                </div>

                {showPagination ? (
                    <StoryPagination
                        className="mt-8"
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={items.length}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        itemLabel="regalos"
                    />
                ) : null}
            </div>
        );
    }

    return (
        <div ref={listTopRef} className="scroll-mt-6">
            {showPagination ? (
                <StoryPagination
                    className="mb-6"
                    currentPage={validCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={items.length}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    itemLabel="regalos"
                />
            ) : null}

            <div className={isPending ? "pointer-events-none opacity-80" : undefined}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={currentItems.map((item) => item.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {currentItems.map((gift) => (
                                <SortableGiftItem key={gift.id} gift={gift} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {showPagination ? (
                <StoryPagination
                    className="mt-8"
                    currentPage={validCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={items.length}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    itemLabel="regalos"
                />
            ) : null}
        </div>
    );
}