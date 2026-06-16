import api from "./api";

export const createInterest = 
async (interest) => {

    const response = await api.post(
        "users/interests/", { interest }
    )
    return response.data;
}

export const getInterests =
    async () => {
        const response = await api.get(
            "users/interests/list/"
        )
        return response.data;
    }

export const deleteInterest = 
    async (id) => {

        await api.delete(
            `users/interests/${id}/delete/`
        );
    };
