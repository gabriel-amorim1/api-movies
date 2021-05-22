import User from '../../database/entities/User';
import { UserResponseInterface } from '../../interfaces/UserInterface';

export const render = async (user: User): Promise<UserResponseInterface> => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
};
