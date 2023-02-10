export interface Thread {
    message: Message,
    replies: Message[]
}

export interface Message {
    type: string,
    text: string,
    user: string,
    isBot: boolean,
    timestamp: string,
}