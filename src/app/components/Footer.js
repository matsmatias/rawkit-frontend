import styles from './Footer.module.css';


export function Footer() {
  return (
    <div className="footer">
      <span className={styles.footerText}>GitHub: <a href="https://github.com/matsmatias" title="GitHub">https://github.com/matsmatias</a></span>
      <br></br>
      <span className={styles.footerText}>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></span>
    </div>
  );
}
