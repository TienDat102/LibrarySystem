import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Profile.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Profile() {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  
      .replace(/\s+/g, '-')           
      .trim();
  };

  useEffect(() => {
    axios.get('http://localhost:5000/book/allBook')
      .then((response) => {
        const allBooks = response.data || [];
        const foundBook = allBooks.find((book) => convertToSlug(book.title) === id);
        if (!foundBook) {
          console.error('Book not found with slug:', id);
        }
        setBook(foundBook);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  }, [id]);

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
        setBook((prevBook) => ({ ...prevBook, registered: true }));
      })
      .catch(error => {
        alert('Đăng ký không thành công.');
        console.error('Error updating book:', error);
      });
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className={cx('profile')}>
      <h1 className={cx('title')}>{book.title}</h1>
      <img className={cx('cover')} src={book.cover_url} alt={book.title} />
      <p className={cx('author')}><strong>Tác giả:</strong> {book.author}</p>
      <p className={cx('publish-year')}><strong>Năm xuất bản:</strong> {book.publish_year}</p>
      <p className={cx('subcategory')}><strong>Thể loại:</strong> {book.subcategory}</p>
      <div className={cx('button-book')}>
        <Button outline onClick={() => handleRegister(book._id)}>Đăng ký</Button>
      </div>
    </div>
  );
}

export default Profile;
