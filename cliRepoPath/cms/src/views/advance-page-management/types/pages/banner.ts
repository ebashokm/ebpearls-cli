export type SubFields = {
    id: string;
    image: {
        image: string;
        alt: string;
    }[];
    content: {
        description: string;
    }[];
    button: {
        label: string;
        url: string;
    }[];
};
