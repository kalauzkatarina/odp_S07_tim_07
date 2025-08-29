import type { ResultOfValidation } from "../../../types/validation/ValidationResult";

export function validateBookData(data: {
  title?: string;
  author?: string;
  summary?: string;
  format?: string;
  pages?: number;
  script?: string;
  binding?: string;
  publish_date?: string;
  isbn?: string;
  cover_image_url?: string;
}): ResultOfValidation {

  if (!data.title || data.title.trim() === "") {
    return { success: false, message: "Title is required." };
  }
  if (data.title.length > 200) {
    return { success: false, message: "Title can have maximum 200 characters." };
  }

  if (!data.author || data.author.trim() === "") {
    return { success: false, message: "Author is required." };
  }
  if (data.author.length > 200) {
    return { success: false, message: "Author can have maximum 200 characters." };
  }

  if (!data.summary || data.summary.trim() === "") {
    return { success: false, message: "Summary is required." };
  }

  if (data.format && data.format.length > 50) {
    return { success: false, message: "Format can have maximum 50 characters." };
  }

  if (data.pages !== undefined && (data.pages <= 0 || !Number.isInteger(data.pages))) {
    return { success: false, message: "Pages must be a positive integer." };
  }

  if (data.script && data.script.length > 50) {
    return { success: false, message: "Script can have maximum 50 characters." };
  }

  if (data.binding && data.binding.length > 50) {
    return { success: false, message: "Binding can have maximum 50 characters." };
  }

  if (data.publish_date && data.publish_date.length > 20) {
    return { success: false, message: "Publish date can have maximum 20 characters." };
  }

  if (data.isbn && data.isbn.length > 20) {
    return { success: false, message: "ISBN can have maximum 20 characters." };
  }

  if (data.cover_image_url && data.cover_image_url.length > 1000) {
    return { success: false, message: "Cover image URL is too long." };
  }

  return { success: true };
}
