import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import dateFormat from 'utils/getDateStr';
export const Card = ({
  id,
  title,
  imageUrl,
  isSecret,
  createdAt,
  updatedAt,
  category,
  isMyPage,
  authorName,
  userId,
}: {
  id: string;
  title: string;
  imageUrl: string;
  isSecret?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  isMyPage?: boolean;
  authorName?: string;
  userId: string;
}) => {
  return (
    <CardStyle>
      <StyledLink
        to={isMyPage ? `/gptpage/prompt/${id}` : `/gptpage/detail/${id}`}
        style={{ width: '100%' }}
      >
        <Image src={imageUrl} alt={title} />
        <Title>{title}</Title>
        <Text>{category}</Text>
        {!isMyPage && (
          <StyledLink to={`/gptpage/user/${userId}`}>
            <Author>{authorName}</Author>
          </StyledLink>
        )}
        {createdAt && updatedAt && (
          <Text>
            {createdAt < updatedAt
              ? ` (수정됨: ${dateFormat(updatedAt)})`
              : `작성일: ${dateFormat(createdAt)}`}
          </Text>
        )}
        {isMyPage && <Status>{isSecret ? '비공개' : '공개'}</Status>}
      </StyledLink>
    </CardStyle>
  );
};
const CardStyle = styled.div`
  flex: 0 0 calc(20% - 16px); // Adjusted to account for gap
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    background-color: #f5f5f5;
    transform: scale(1.03);
    transition: all 0.3s ease;
  }
`;
const StyledLink = styled(RouterLink)`
  width: 100%;
  color: inherit; // 기본 글자색을 상속받음

  &:visited {
    color: inherit; // 방문 후에도 기본 글자색을 유지
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  object-fit: cover;
`;
const Author = styled.p`
  text-align: center;
  padding: 10px;
  font-weight: bold;
  font-size: 1rem;
  z-index: 1;
  transition:
    transform 0.2s,
    color 0.2s;
  text-decoration: none;
  &:hover {
    transform: scale(1.1);
    background-color: rgba(30, 9, 9, 0.8);
  }
`;
const Title = styled.p`
  text-align: center;
  padding: 10px;
  font-weight: bold;
  color: black;
  font-size: 1rem;
`;

const Text = styled.p`
  text-align: center;
  padding: 5px;
  font-size: 0.9em;
  color: #757575;
`;

const Status = styled.p`
  text-align: center;
  padding: 5px;
  font-size: 0.8em;
  color: ${(props) => (props.children === '비공개' ? '#f44336' : '#4caf50')};
`;