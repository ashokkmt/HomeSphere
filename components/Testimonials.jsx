import '../styles/Testimonials.css'

function Testimonials({ testimonial, key }) {
    return (
        <div key={key} className="testimonialCard">
            <div className="testimonialHeader">
                <img src={testimonial.image} alt={testimonial.name} className="testimonialAvatar" />
                <div>
                    <h4 className="testimonialName">{testimonial.name}</h4>
                    <div className="testimonialRating">
                        {
                            [...Array(5)].map((_, i) => (
                                <i key={i} data-feather="star" fill={i < testimonial.rating ? 'currentColor' : 'none'} stroke="currentColor">
                                </i>
                            ))
                        }
                    </div>
                </div>
            </div>
            <p className="testimonialText">{testimonial.text}</p>
        </div>
    )
}

export default Testimonials
