import Vote from '../../database/entities/Vote';

export default class VoteBuilder {
    vote: Vote;

    constructor() {
        this.vote = {} as Vote;
    }

    public withId(id: string): VoteBuilder {
        this.vote.id = id;
        return this;
    }

    public withUserId(user_id: string): VoteBuilder {
        this.vote.user_id = user_id;
        return this;
    }

    public withMovieId(movie_id: string): VoteBuilder {
        this.vote.movie_id = movie_id;
        return this;
    }

    public withRating(rating: number): VoteBuilder {
        this.vote.rating = rating;
        return this;
    }

    public withCreatedAt(createdAt: Date): VoteBuilder {
        this.vote.created_at = createdAt;
        return this;
    }

    public withUpdatedAt(updatedAt: Date): VoteBuilder {
        this.vote.updated_at = updatedAt;
        return this;
    }

    public build(): Vote {
        return this.vote;
    }
}
