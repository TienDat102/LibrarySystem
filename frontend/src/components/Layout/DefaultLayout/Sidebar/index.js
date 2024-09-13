import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Sidebar.module.scss';
import { getCookie } from '~/components/cookies/cookieHelper';  

const cx = classNames.bind(styles);

const Sidebar = () => {
  const { id } = useParams();
  const [topReadBooks, setTopReadBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 2;
  const [isLoggedIn, setIsLoggedIn] = useState(false);  

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const token = getCookie('jwt');
    setIsLoggedIn(!!token);  

    if (id && isLoggedIn) {  
      const fetchTopReadBooks = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/book/recommend/${id}`);
          const books = response.data.data;
          
          // Đặt sách gợi ý nếu có
          setTopReadBooks(books);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu sách:', error);
        }
      };

      fetchTopReadBooks();
    }
  }, [id, isLoggedIn]);  

  useEffect(() => {
    if (!isLoggedIn) return;  // Không thực hiện phân trang nếu chưa đăng nhập

    const intervalId = setInterval(() => {
      setCurrentPage(prevPage => {
        const totalPages = Math.ceil(topReadBooks.length / booksPerPage);
        return prevPage === totalPages ? 1 : prevPage + 1;
      });
    }, 6000);

    return () => clearInterval(intervalId);
  }, [topReadBooks, booksPerPage, isLoggedIn]);  // Thêm isLoggedIn vào dependencies

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = topReadBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(topReadBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationItems = () => {
    return [...Array(totalPages)].map((_, index) => (
      <div
        key={index}
        className={cx('page-item-container', { active: index + 1 === currentPage })}
      >
        <div
          className={cx('page-item', { active: index + 1 === currentPage })}
          onClick={() => handlePageChange(index + 1)}
        />
      </div>
    ));
  };

  if (!isLoggedIn) {
    return null;  // Không hiển thị Sidebar nếu chưa đăng nhập
  }

  return (
    <aside className={cx('sidebar')}>
      <h3 className={cx('title')}>Sách gợi ý cho bạn:</h3>
      {topReadBooks.length > 0 ? (
        <>
          <div className={cx('book-list')}>
            {currentBooks.map(book => (
              <Link to={`/book/${book._id}`} key={book._id} className={cx('book-item')}>
                <img src={book.cover_url} alt={book.title} className={cx('book-cover')} />
                <div className={cx('book-details')}>
                  <p className={cx('book-title')}>{book.title}</p>
                  <p className={cx('book-author')}>{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className={cx('pagination')}>
            {getPaginationItems()}
          </div>
        </>
      ) : (
        <p className={cx('no-books-message')}>Không có sách gợi ý</p>
      )}
    </aside>
  );
};

export default Sidebar;
