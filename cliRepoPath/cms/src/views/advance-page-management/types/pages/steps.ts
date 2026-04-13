export type mainFields = {
    title: {
        text: string;
    }[];
};

export type subFields = {
    id: string;
    steps: {
        image: string;
        title: string;
        description: string;
    }[];
};
