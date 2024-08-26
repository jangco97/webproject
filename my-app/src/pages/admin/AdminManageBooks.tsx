import { Fragment, useCallback, useEffect, useState } from 'react';

import * as S from 'styles/AdminStyledTemp';
import { bookQueries } from 'queries';
import { useSelectedBook } from 'store/useSelectedBooks';
import { getDateStr } from 'utils';
import { BookInfoType } from 'types/bookTypes';
import { useQueryClient } from '@tanstack/react-query';
import { getNextBooks } from 'api/book';
import { CustomModal } from 'components/modal/CustomModal';
import Loader from 'components/shared/Loader';
import { QueryKeys } from 'constant';
import useAdminPagination from 'hooks/useAdminPagination';
import AdminPagination from 'components/admin/AdminPagination';
const AdminManage = () => {
  const { useDeleteBook, useGetBooksAdmin } = bookQueries;
  const { currentPage, setCurrentPage, handleNavigate, handlePrevPage, handleNextPage } =
    useAdminPagination();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { setSelectedBook } = useSelectedBook();
  const { mutate: remove } = useDeleteBook(currentPage);

  const { data: books, status } = useGetBooksAdmin({
    take: 10,
    page: currentPage,
    order__createdAt: 'DESC',
    where__title__i_like: '',
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage) {
      const key = [QueryKeys.ADMIN, 'books', (currentPage + 1).toString()];
      queryClient.prefetchQuery({
        queryKey: key,
        queryFn: () =>
          getNextBooks({
            take: 10,
            page: currentPage + 1,
            order__createdAt: 'DESC',
            where__title__i_like: '',
          }),
      });
    }
  }, [currentPage, queryClient]);

  const unshowScroll = () => {
    document.body.style.overflow = 'hidden';
  };
  const showScroll = () => {
    document.body.style.overflow = 'unset';
  };
  const findSelectedBook = useCallback(() => {
    return books?.data.find((book) => book?.id === selectedBookId);
  }, [books, selectedBookId]);
  const selectedBook = findSelectedBook();
  const handleClick = (id: string) => {
    setModalOpen(true);
    unshowScroll();
    setSelectedBookId(id); // 선택된 책의 ID를 상태에 저장
  };

  const handleEdit = (id: string) => {
    if (!books) return;
    const selectedBook: BookInfoType | undefined = books.data.find((book) => book.id === id);
    if (!selectedBook) return;
    const { images, title, content, authorName, category } = selectedBook;

    setSelectedBook({ title, content, images, authorName, category });
    handleNavigate('BookTakelistRes', id);
  };

  const handleRemove = (id: string) => {
    remove(id);
  };

  if (status === 'loading' || !books) {
    return <S.Layout>{status === 'loading' && <Loader />}</S.Layout>;
  }

  return (
    <S.Layout>
      <S.Container>
        <S.Table>
          <S.Theader>
            <S.Trow>
              <S.Tcolumn>No.</S.Tcolumn>
              <S.Tcolumn>제목</S.Tcolumn>
              <S.Tcolumn>생성자</S.Tcolumn>
              <S.Tcolumn>조회수</S.Tcolumn>
              <S.Tcolumn>댓글</S.Tcolumn>
              <S.Tcolumn>생성일</S.Tcolumn>
              <S.Tcolumn />
            </S.Trow>
          </S.Theader>
          <S.Tbody>
            {status === 'success' &&
              books.data.map((book, index) => {
                return (
                  <Fragment key={book.id}>
                    <S.Trow>
                      <S.Tcell width={30}>{(currentPage - 1) * 10 + index + 1}</S.Tcell>
                      <S.Tcell width={300}>
                        <button onClick={() => handleClick(book.id)}>{book.title}</button>
                      </S.Tcell>
                      <S.Tcell width={120}>{book.user.name}</S.Tcell>
                      <S.Tcell>{book.clicks}</S.Tcell>
                      <S.Tcell>{getDateStr(book.createdAt)}</S.Tcell>
                      <S.Tcell>
                        <S.EditIcon onClick={() => handleEdit(book.id)} />
                        <S.TrashIcon onClick={() => handleRemove(book.id)} />
                      </S.Tcell>
                    </S.Trow>
                    {modalOpen && (
                      <CustomModal
                        bookId={selectedBookId}
                        book={selectedBook}
                        setModalOpen={setModalOpen}
                        showScroll={showScroll}
                      ></CustomModal>
                    )}
                  </Fragment>
                );
              })}
          </S.Tbody>
        </S.Table>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <AdminPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={books.total}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
          />
        </div>
      </S.Container>
    </S.Layout>
  );
};

export default AdminManage;