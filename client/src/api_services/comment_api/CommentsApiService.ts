import axios from "axios";
import type { CommentDto } from "../../models/comments/CommentDto";
import type { ICommentsApiService } from "./ICommentsApiService";

const API_URL: string = import.meta.env.VITE_API_URL + "comment";

const emptyComment: CommentDto = {
    id: 0,
    content: "",
    user_id: 0,
    book_id: 0
};

export const commentsApi: ICommentsApiService = {
    async getAllCommentsByBook(book_id: number): Promise<CommentDto[]> {
        try {
            const res = await axios.get<CommentDto[]>(`${API_URL}s/getComments/${book_id}`);
            return res.data;
        }
        catch {
            return [];
        }
    },
    async createComment(content: string, book_id: number, user_id: number, token: string): Promise<CommentDto> {
        try {
            const res = await axios.post<CommentDto>(
                `${API_URL}s/createComment`,
                { content, book_id, user_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch {
            return emptyComment;
        }
    },
    async deleteComment(token: string, id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch {
            return false;
        }
    }
}