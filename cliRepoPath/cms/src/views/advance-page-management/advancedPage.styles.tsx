import styled from 'styled-components';

export const SearchContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;

    .heading-main {
        letter-spacing: 0.25em;
        padding: 1rem;
    }
`;

export const SectionWrapper = styled.div`
    position: absolute;
    height: 200px;
    background: #f3f3f3;
`;

export const Section = styled.div``;
export const PageWrapper = styled.div`
    position: relative;

    ::-webkit-scrollbar {
        display: none;
    }
    > * {
        margin: 1rem;
    }
`;
