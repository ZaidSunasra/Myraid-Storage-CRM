export const capitalize = (str: string) =>str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const toTitleCase = (str: string) =>str.replace(/_/g, " ").split(" ").map((word : string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
