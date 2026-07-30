# PRD: Between the Lines

## Problem
A personal reading journal to log the books I read and capture what I thought
of them — rating, quotes, and reflections in one place.

## Target user
Just me — a single-user personal app, no accounts or sharing.

## User stories
- As a reader, I want to add a book with title, author and genre tags so that I can log what I've read
- As a reader, I want to rate a book from 0–5 stars (in half-star steps) so that I can capture how much I enjoyed it
- As a reader, I want to write my thoughts about a book so that I can remember my reflections later
- As a reader, I want to save favorite quotes from a book so that I can revisit meaningful passages
- As a reader, I want to see my books grouped by the year I read them so that I can browse my reading history over time
- As a reader, I want to edit or delete a book entry so that I can fix mistakes or remove books I no longer want tracked

## MVP scope

### In scope
- Add a book — title, author, genre tags
- Edit / delete a book entry
- Rate a book — 0–5 stars, half-star increments
- Write thoughts/review per book
- Save quotes per book (separate field)
- List overview, grouped by year read

### Out of scope
- Search / filter by genre, rating, or author
- Stats dashboard (books per year, average rating, genre breakdown)
- Cover image upload
- Reading progress (started/finished dates, pages read)

## Data model

### Collection: books
| Field | Type | Description |
|-------|------|-------------|
| id | number | Sequential identifier, new = highest existing + 1 |
| title | string | Book title |
| author | string | Book author |
| genres | string[] | Genre tags |
| rating | number | 0–5, in steps of 0.5 |
| thoughts | string | Personal reflections / review |
| quotes | string[] | Favorite quotes from the book |
| yearRead | number | Year the book was read (used to group the list view) |
| createdAt | string (ISO 8601) | Creation timestamp |

## Relationships

Single collection, no relations between entities.

## Initial data shape

```json
{
  "books": []
}
```

**Save this initial content to `data/app.json`** and commit it. Empty collections
in git mean the app works immediately after a clone instead of crashing on a
missing file.
