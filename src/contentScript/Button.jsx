import styles from './Button.module.scss';

const Button = ({ onClick }) => {
    return (
        <div
            id="our-too-specific-id-to-find"
            className={styles.button}
            onClick={onClick}
        >
            <span
                title="Send tips!"
            >
                Ⓝ
            </span>
        </div>
    )
}

export default Button;
