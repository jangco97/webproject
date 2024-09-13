import { styled } from 'styled-components';
import { Stars, Stars2, Stars3 } from 'styles/StarParticles';
import Loader from 'components/shared/Loader';
import NotFound from 'pages/NotFound';
import BookList from 'components/user/BookList';
import SearchBar from 'components/shared/SearchBar';
import { useBookData } from 'hooks/useBookData';
import { useSearch } from 'hooks/useSearch';
import { useMemo } from 'react';
import Bottom from 'components/layout/Bottom';

const ReviewPage = () => {
  const {
    searchTitle,
    searchAuthorName,
    setSearchTitle,
    setSearchAuthorName,
    order,
    setOrder,
    category,
  } = useSearch();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, hasBooks } = useBookData(
    order,
    searchTitle,
    searchAuthorName,
    category,
  );

  const memoizedBookList = useMemo(
    () => (
      <BookList
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    ),
    [data, fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <>
      <Main>
        <Stars />
        <Stars2 />
        <Stars3 />

        <SearchBar
          setSearchTitle={setSearchTitle}
          setSearchAuthorName={setSearchAuthorName}
          order={order}
          setOrder={setOrder}
          backColorType="black"
        />
        <LayoutContainer>
          {status === 'loading' ? (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          ) : hasBooks ? (
            memoizedBookList
          ) : (
            <NotFound search={searchTitle || searchAuthorName} />
          )}
        </LayoutContainer>
      </Main>
      <Bottom />
    </>
  );
};

export default ReviewPage;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10%;
  position: relative;
  background-color: #121212;
`;
const LayoutContainer = styled.div`
  display: flex;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: relative;
`;