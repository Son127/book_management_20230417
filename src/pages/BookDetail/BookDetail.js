/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';import axios from 'axios';

const mainContainer = css`
    padding: 10px;
`;

const BookDetail = () => {

    const {bookId} = useParams();
    const queryClient = useQueryClient();
    // console.log(queryClient.getQueryData("principal").data.userId);


    const getBook = useQuery(["getBook"], async() => {

        const option = {
            headers:{
                Authorization:localStorage.getItem("accessToken")
            }
        }
     
       const response =  await axios.get(`http://localhost:8080/book/${bookId}`,option)

       return response;
    }); 

    const getLikeCount = useQuery(["getLikeCount"], async () => {
        
        const option = {
            headers:{
                Authorization:localStorage.getItem("accessToken")
            }
        }
        const response =  await axios.get(`http://localhost:8080/book/${bookId}/like`,option)

        return response;
    });

    const getLikeStatus = useQuery(["getLikeStatus"], async () => {
        
        const option = {
            params: {
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers:{
                Authorization:localStorage.getItem("accessToken")
            }
        }
        const response =  await axios.get(`http://localhost:8080/book/${bookId}/like/status`,option)

        return response;
    });

    
    if(getBook.isLoading){
        return <div>로딩중...</div>
    } 
    return (
        <div css={mainContainer}>
            <Sidebar/> 
            <header>
                <h1>{getBook.data.data.bookName}</h1>
                <p>
                    분류:{getBook.data.data.categoryName} / 
                    저자명:{getBook.data.data.authorName} / 
                    출판사:{getBook.data.data.publisherName} / 
                    추천: {getLikeCount.isLoading ? "조회중..." : getLikeCount.data.data}</p>
            </header>
            <main>
                <div>
                    <img src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName} />
                </div>
                <div>
                    
                </div>
                <div>
                    {getLikeStatus.isLoading ? "" 
                        : getLikeStatus.data.data === 0 
                            ? (<button>추천하기</button>)
                            :(<button>추천취소</button>)}
                </div>
            </main>
        </div>
    );
};

export default BookDetail;

// const getBook = useQuery ([캐시키], 실행 될 함수, 옵션); 3개의 파라미터를 받는다
// axios.get("url", 객체형태 옵션)