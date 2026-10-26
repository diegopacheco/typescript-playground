export const GENRES = ["scifi", "fantasy", "mystery", "tech"] as const;

export type Genre = (typeof GENRES)[number];

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  year: number;
  rating: number;
  isbn: string;
  tags: string[];
  favorite: boolean;
};

export const SEED_BOOKS: readonly Book[] = [
  { id: 1, title: "Dune", author: "Frank Herbert", genre: "scifi", year: 1965, rating: 4.6, isbn: "9780441013593", tags: ["desert", "epic"], favorite: true },
  { id: 2, title: "Neuromancer", author: "William Gibson", genre: "scifi", year: 1984, rating: 4.1, isbn: "9780441569595", tags: ["cyberpunk"], favorite: false },
  { id: 3, title: "Foundation", author: "Isaac Asimov", genre: "scifi", year: 1951, rating: 4.3, isbn: "9780553293357", tags: ["empire"], favorite: false },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fantasy", year: 1937, rating: 4.7, isbn: "9780547928227", tags: ["dragons", "journey"], favorite: true },
  { id: 5, title: "Mistborn", author: "Brandon Sanderson", genre: "fantasy", year: 2006, rating: 4.5, isbn: "9780765311788", tags: ["magic"], favorite: false },
  { id: 6, title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genre: "fantasy", year: 1968, rating: 4.2, isbn: "9780547773742", tags: ["magic", "islands"], favorite: false },
  { id: 7, title: "Gone Girl", author: "Gillian Flynn", genre: "mystery", year: 2012, rating: 4.0, isbn: "9780307588371", tags: ["thriller"], favorite: false },
  { id: 8, title: "The Big Sleep", author: "Raymond Chandler", genre: "mystery", year: 1939, rating: 4.0, isbn: "9780394758282", tags: ["noir"], favorite: false },
  { id: 9, title: "And Then There Were None", author: "Agatha Christie", genre: "mystery", year: 1939, rating: 4.4, isbn: "9780062073488", tags: ["island", "classic"], favorite: true },
  { id: 10, title: "Clean Code", author: "Robert C. Martin", genre: "tech", year: 2008, rating: 4.4, isbn: "9780132350884", tags: ["craft"], favorite: false },
  { id: 11, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", genre: "tech", year: 2017, rating: 4.8, isbn: "9781449373320", tags: ["distributed"], favorite: true },
  { id: 12, title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "tech", year: 1999, rating: 4.3, isbn: "9780201616224", tags: ["craft"], favorite: false },
];
