export const convertEmailIntoArray = (emails?: { email?: string }[]): string[] => {
    const emailStrings = emails?.map((e: any) => e.email?.trim()).filter((e: any): e is string => !!e) ?? [];
    return emailStrings;
}

export const convertPhoneIntoArray = (phones: { number: string }[]): string[] => {
    const phoneStrings = phones
        ?.map((e: any) => e.number?.trim())
        .filter((e: any): e is string => !!e) ?? [];
    return phoneStrings;
}