import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import styles from "./signin.module.scss";

const SignIn = () => {
    return(
        <div className={styles.formContainer}>
            <Form >
            <Form.Group className="mb-3" controlId="formControlUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button href="home" variant="primary" type="submit">
                Login
            </Button>
            </Form>
        </div>
    ); 
}

export default SignIn