export class FeaturedBooks {
    public constructor(
        public id: number = 0,
        public book_id: number = 0,
        public editor_id: number = 0,
        public featured_at: Date = new Date()
    ) { }
}