/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';import axios from 'axios';

const mainContainer = css`
    padding: 10px;
`;

const BookDetail = () => {
    const { bookId } = useParams();
    //async는 콜백함수 앞에
    const getBook = useQuery(["getBook"], async() =>{ //
        const option = { //
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }// await는 프로미스에만 사용가능
        const response = await axios.get(`http://localhost:8080/book/${bookId}`, option)  
        return response
    });

    if(getBook.isLoading){
        return <div>불러오는 중...</div>
    }

    if(!getBook.isLoading)
    return (
        <div css={mainContainer}>
            <Sidebar/> 
            <header>
                <h1>{getBook.data.data.bookName}</h1>
                <p>분류: {getBook.data.data.categoryName}/ 저자명: {getBook.data.data.authorName}/ 출판사: {getBook.data.data.publisherName}/ 추천: </p>
            </header>
            <main>
                <div>
                    <img src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName} />
                </div>
                <div>
                    
                </div>
                <div>

                </div>
            </main>
        </div>
    );
};

export default BookDetail;

// const getBook = useQuery ([캐시키], 실행 될 함수, 옵션); 3개의 파라미터를 받는다
// axios.get("url", 객체형태 옵션)