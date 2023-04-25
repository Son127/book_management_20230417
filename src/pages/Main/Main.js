/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BookCard from '../../components/UI/BookCard/BookCard';
import axios from 'axios';
import { useQuery } from 'react-query';

const mainContainer = css`
    padding: 10px;
`;
const header = css`
    display: flex;
    justify-content: space-between;
    height: 100px;
`;
const main = css`
    display: flex;
    flex-wrap: wrap;
    height: 750px;
    overflow-y: auto; //메인 안에서만 스크롤 생성
`;

const Main = () => {
    
    const [ searchParam, setSearchParam ] = useState({page: 1, searchValue: "", categoryId: 0 });
    const [ reFresh, setRefresh ] = useState(false);
    const [ books, setBooks ] = useState([]);
    const lastBookRef = useRef();

    useEffect(() => {
        const observerService = (entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersectiong){
                    console.log("마지막 요소를 발견함");
                    setRefresh(true);
                }
            });
        }

        const observer = new IntersectionObserver(observerService,{threshold: 1}); //IntersectionObserver(콜백함수, {객체})
        observer.observe(lastBookRef.current); // 들어가는 함수가 화면에 보이면 콜백함수를 실행해라
    }, []);

    const option ={
        params: searchParam,
        headers:{
            Authorization: localStorage.getItem("accessToken")
        }
    }
    const searchBooks = useQuery(["searchBooks"],async () => {
        const response = await axios.get("http://localhost:8080/books", option);
        return response
    },{
        onSuccess:(response) => {
            if(reFresh){
                setRefresh(false);
            }
            setBooks([...books, ...response.data]);
            setSearchParam({...searchParam, page: searchParam.page + 1});
        },
        enabled: reFresh
    } );




    return (
        <div css={mainContainer}>
            <Sidebar></Sidebar>
            <header css={header}>
                <div>도서검색</div>
                <div> 
                    <input type='search' />
                </div>
            </header>
            <main css={main}>
                {books.length > 0 ? books.map(book => (<BookCard key={book.bookId} book={book}></BookCard>)) : ""}  {/* */}
                <div ref={lastBookRef}></div>
            </main>
        </div>
    );
};

export default Main;