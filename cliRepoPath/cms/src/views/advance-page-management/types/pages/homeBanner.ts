export type SubFields = {
    id: string;
    image: {
        image: string;
        alt: string;
    }[];
    content: {
        heading: string;
    }[];
    button: {
        label: string;
        url: string;
    }[];
};
