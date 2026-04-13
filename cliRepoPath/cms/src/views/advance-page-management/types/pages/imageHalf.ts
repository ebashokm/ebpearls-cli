export type mainFields = {
    title: {
        text: string;
    }[];
};

export type subFields = {
    id: string;
    image: {
        image: string;
        url: string;
    }[];
    content: {
        main: string;
        sub: string;
        text: string;
    }[];
    button: {
        label: string;
        url: string;
    }[];
};
