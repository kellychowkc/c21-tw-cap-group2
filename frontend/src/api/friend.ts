import { fetchJson } from "./utils";

export interface OtherUserProfile {
    id: number;
    username: string;
    country_id?: string;
    jobTitle: string;
    information: string;
    interests: string[];
    profile: string;
}

const { REACT_APP_API_SERVER } = process.env;

export async function fetchOtherUserProfile(userId: number) {
    return fetchJson(`${REACT_APP_API_SERVER}/match`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
    });
}

export async function likedUserAction(id: number, userId: number) {
    return fetchJson(`${REACT_APP_API_SERVER}/match/like`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ id: id, userId: userId }),
    });
}

export async function unlikedUserAction(id: number, userId: number) {
    return fetchJson(`${REACT_APP_API_SERVER}/match/unlike`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ id: id, userId: userId }),
    });
}
