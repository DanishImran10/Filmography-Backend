import { prisma, connectDB, disconnectDB } from "../dbConnect.ts";
import movies from "./movies_dataset.ts";

function extractData() {
    const movies_data = movies.map((movie) => ({
        title: movie.Title,
        year: movie.Year,
        runtime: movie.Runtime,
        director: movie.Director,
        writer: movie.Writer,
        cast: movie.Actors,
        imdbRating: Number(movie.imdbRating),
        tomatoScore: Number(movie.Metascore),
        genre: movie.Genre,
        plot: movie.Plot,
        posterUrl: movie.Poster,
    }));

    return movies_data;
}

async function seed() {
    const movies = extractData();

    await connectDB();

    await prisma.movie.createMany({
        data: movies
    });
}

await seed();
disconnectDB();