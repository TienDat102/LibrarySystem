import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Result.module.scss';
import { Button } from 'antd';
import Pagination from '~/components/Pagination';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const BOOKS_PER_PAGE = 20;

function Result() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');
  const subcategory = searchParams.get('subcategory');

  // Chuyển đổi title thành slug
  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  
      .replace(/\s+/g, '-')           
      .trim();
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/book/allBook?search=${encodeURIComponent(query || '')}&subcategory=${encodeURIComponent(subcategory || '')}`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error))
      .finally(() => setLoading(false));
  }, [query, subcategory]);

  // Pagination
  const indexOfLastBook = currentPage * BOOKS_PER_PAGE;
  const indexOfFirstBook = indexOfLastBook - BOOKS_PER_PAGE;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);

  // Hàm xử lý nút Đăng ký
  const handleRegister = (bookId) => {
    fetch(`http://localhost:5000/book/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert('Đăng ký thành công!');
        // Tải lại danh sách sách
        fetch(`http://localhost:5000/book/allBook?search=${encodeURIComponent(query || '')}&subcategory=${encodeURIComponent(subcategory || '')}`)
          .then(response => response.json())
          .then(data => setBooks(data))
          .catch(error => console.error('Error fetching updated books:', error));
      })
      .catch(error => console.error('Error updating book:', error));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={cx('result')}>
      <h2>Kết Quả Tìm Kiếm{query ? ` Cho: "${query}"` : ''}{subcategory ? ` - Thể loại: "${subcategory}"` : ''}</h2>
      <div className={cx('book-list')}>
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div className={cx('book-item')} key={book.id}>
              <Link to={`/book/${convertToSlug(book.title)}`} className={cx('book-wrapper')}>
                <img
                  className={cx('book-cover')}
                  src={book.cover_url}
                  alt={book.title}
                />
                <div className={cx('book-info')}>
                  <p className={cx('book-title')}>{book.title}</p>
                </div>
              </Link>
              <div className={cx('button-book')}>
                <Button onClick={() => handleRegister(book.id)}>Đăng ký</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Result;
