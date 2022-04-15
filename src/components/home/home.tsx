import Carousel from "react-bootstrap/esm/Carousel"
import Image from './swsp-image.png'
import styles from './home.module.scss'

const Home = () => {
    return(
        <div className={styles.home}>
            <Carousel>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=Second slide&bg=282c34"
                    alt="First slide"
                    width="700px"
                    height="400px"
                    />
                    <Carousel.Caption>
                        <h3>Patients</h3>
                        <p>View organizations' patients and modify their data using the SWSP-organization tool!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=Second slide&bg=282c34"
                    alt="Second slide"
                    width="700px"
                    height="400px"
                    />
                    <Carousel.Caption>
                        <h3>Caregivers</h3>
                        <p>View organizations'caregivers and modify their data using the SWSP-organization tool!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=Third slide&bg=20232a"
                    alt="Third slide"
                    width="700px"
                    height="400px"
                    />
                    <Carousel.Caption>
                        <h3>Patient-groups</h3>
                        <p>View organizations' patient-groups and modify their </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>    
    )
}

export default Home