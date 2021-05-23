import Movie from '../../database/entities/Movie';

export default class MovieBuilder {
    movie: Movie;

    constructor() {
        this.movie = {} as Movie;
    }

    public withId(id: string): MovieBuilder {
        this.movie.id = id;
        return this;
    }

    public withName(name: string): MovieBuilder {
        this.movie.name = name;
        return this;
    }

    public withDirector(director: string): MovieBuilder {
        this.movie.director = director;
        return this;
    }

    public withGenre(genre: string): MovieBuilder {
        this.movie.genre = genre;
        return this;
    }

    public withActors(actors: string): MovieBuilder {
        this.movie.actors = actors;
        return this;
    }

    public withCreatedAt(createdAt: Date): MovieBuilder {
        this.movie.created_at = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt: Date): MovieBuilder {
        this.movie.updated_at = updatedAt;
        return this;
    }

    public build(): Movie {
        return this.movie;
    }
}
