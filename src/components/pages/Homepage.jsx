import CardProduct from "../CardProduct";
import Features from "../Feature";
import Hero from "../Hero";
import Imagesgrid from "../Imagesgrid";

const Homepage = () => {
    return (
        <div>
            <Hero />
            <CardProduct />
            <Imagesgrid />
            <Features />
        </div>
    );
};

export default Homepage;