import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
/**
 * 1 Receive the code from a string
 * 2 Return Github token
 * 3 Check if the user exists in DB
 * 4 Yes -- generate a token
 * 5 NO  -- Create one in DB and generates a token
 * 6 Return a token and user info
 *  */
interface IAccessTokenResponse {
    access_token: string
}
interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";
        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        })
        const response = await axios.get<IUserResponse>('https://api.github.com/user', {
            headers: {
                authorization: `bearer ${accessTokenResponse.access_token}`
            }
        })
        const { login, id, avatar_url, name } = response.data;
        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id // check if theres an user in github with current id
            }
        });
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name // until you conclude here there will be an error in data (For optional param use ? after a field in the schema)
                }


            })
        }
        const token = sign({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id

            },

        },
            process.env.PRJ_SECRET,
            {
                subject: user.id,
                expiresIn: "1d" // one day
            }
        )
        // return response.data;  //axios return inside Data
        return { token, user }
    }
}
export { AuthenticateUserService }



