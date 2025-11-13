import Header from '../header/Header.jsx';
import styles from './layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>© {new Date().getFullYear()} AutoWiki</footer>
    </div>
  );
}
