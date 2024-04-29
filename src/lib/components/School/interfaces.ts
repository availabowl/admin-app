export interface DeleteSchoolMutateProps {
    /** UUID of the school to be deleted. */
    id: string;
    /** Index of the paginated query (page). */
    pageIndex: number;
    /** Index of the element within the page's School[] array. */
    elementIndex: number;
};