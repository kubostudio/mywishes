"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageSizeOption = number | "all";

type StoryPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    pageSize?: PageSizeOption;
    onPageSizeChange?: (size: PageSizeOption) => void;
    pageSizeOptions?: PageSizeOption[];
    itemLabel?: string;
    className?: string;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function StoryPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize,
    onPageSizeChange,
    pageSizeOptions = [6, 10, 20, 50, "all"],
    itemLabel = "regalos",
    className,
}: StoryPaginationProps) {
    const selectId = useId();

    if (totalItems !== undefined && totalItems <= 3) {
        return null;
    }

    if (totalPages <= 1 && (!totalItems || totalItems <= 3) && !onPageSizeChange) {
        return null;
    }

    const pages = getPageNumbers(currentPage, totalPages);

    const isAll = pageSize === "all";
    const startItem = isAll
        ? totalItems === 0
            ? 0
            : 1
        : typeof pageSize === "number"
        ? (currentPage - 1) * pageSize + 1
        : null;
    const endItem = isAll
        ? totalItems ?? null
        : typeof pageSize === "number" && totalItems !== undefined
        ? Math.min(currentPage * pageSize, totalItems)
        : typeof pageSize === "number"
        ? currentPage * pageSize
        : null;

    return (
        <nav
            role="navigation"
            aria-label="Paginación de regalos"
            className={cn(
                "flex flex-col items-center justify-between gap-4 rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-4 shadow-[0_12px_30px_rgba(101,67,33,0.08)] sm:flex-row sm:px-6",
                className
            )}
        >
            {/* Counter info and page size dropdown */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4">
                {totalItems !== undefined && startItem !== null && endItem !== null ? (
                    <p className="text-sm font-bold text-[#7A5631]">
                        Mostrando{" "}
                        <span className="font-black text-[#3E260E]">
                            {totalItems === 0 ? 0 : startItem}
                        </span>{" "}
                        -{" "}
                        <span className="font-black text-[#3E260E]">{endItem}</span> de{" "}
                        <span className="font-black text-[#3E260E]">{totalItems}</span>{" "}
                        {itemLabel}
                    </p>
                ) : (
                    <p className="text-sm font-bold text-[#7A5631]">
                        Página <span className="font-black text-[#3E260E]">{currentPage}</span> de{" "}
                        <span className="font-black text-[#3E260E]">{totalPages}</span>
                    </p>
                )}

                {onPageSizeChange ? (
                    <div className="inline-flex items-center gap-2">
                        <label
                            htmlFor={selectId}
                            className="text-xs font-bold text-[#7A5631]"
                        >
                            Por página:
                        </label>
                        <select
                            id={selectId}
                            value={pageSize}
                            onChange={(e) => {
                                const val =
                                    e.target.value === "all" ? "all" : Number(e.target.value);
                                onPageSizeChange(val as PageSizeOption);
                            }}
                            className="h-9 cursor-pointer rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-3 text-xs font-black text-[#5A371C] transition hover:bg-[#FFEFC4] focus:outline-none focus:ring-2 focus:ring-[#F8D56B]"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt === "all" ? "Todos" : opt}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-xs font-black text-[#5A371C] transition-all hover:bg-[#FFEFC4] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4 text-[#A47A42]" />
                        <span className="hidden sm:inline">Anterior</span>
                    </button>

                    {/* Compact page indicator for small mobile screens */}
                    <div className="flex items-center px-2 text-xs font-black text-[#5A371C] sm:hidden">
                        {currentPage} / {totalPages}
                    </div>

                    {/* Page Numbers for tablet and desktop */}
                    <div className="hidden items-center gap-1.5 sm:flex">
                        {pages.map((page, index) => {
                            if (page === "...") {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="flex size-11 items-center justify-center text-sm font-black text-[#A47A42]"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const isCurrent = page === currentPage;
                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => onPageChange(page)}
                                    aria-current={isCurrent ? "page" : undefined}
                                    aria-label={`Ir a la página ${page}`}
                                    className={cn(
                                        "flex size-11 items-center justify-center rounded-full text-xs font-black transition-all active:scale-95",
                                        isCurrent
                                            ? "border-2 border-[#B97A22] bg-[#F8C63D] text-[#3E260E] shadow-[0_4px_0_#B97A22] -translate-y-0.5"
                                            : "border-2 border-[#E8C78A] bg-[#FFF8E7] text-[#5A371C] hover:bg-[#FFEFC4]"
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-xs font-black text-[#5A371C] transition-all hover:bg-[#FFEFC4] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Página siguiente"
                    >
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="size-4 text-[#A47A42]" />
                    </button>
                </div>
            ) : null}
        </nav>
    );
}
