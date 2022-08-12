@extends('user.include.parent')
{{-- {{ dd(phpinfo()) }} --}}
@section('contant')
    <section id="hero" class="d-flex align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1">
                    <h1>{{ __('Bettter digital experience with Muscat Apps') }}</h1>
                    <h2>{{ __('We are team of developers and designers develop websites and Apps') }}</h2>
                    <a href="#contact" class="btn-get-started scrollto">{{ __('Get Started') }}</a>
                </div>
                <div class="col-lg-6 order-1 order-lg-2 hero-img">
                    <img src="assets/img/hero-img.svg" class="img-fluid animated" alt="">
                </div>
            </div>
        </div>

    </section>

    <main id="main">
        <section id="about" class="about">
            <div class="container">
                <div class="row justify-content-between">
                    <div class="col-lg-5 d-flex align-items-center justify-content-center about-img">
                        <img src="assets/img/about-img.svg" class="img-fluid" alt="" data-aos="zoom-in">
                    </div>
                    <div class="col-lg-6 pt-5 pt-lg-0">
                        <h3 data-aos="fade-up">Muscat Apps Company</h3>
                        <p data-aos="fade-up" data-aos-delay="100">
                            Muscat Apps is an Omani company that was launched as a result of the joint efforts of young
                            talents with the aim of participating in the modern information technology revolution.
                        </p>
                        <div class="row">
                            <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                                <i class="bx bx-receipt"></i>
                                <h4>Customer service</h4>
                                <p>
                                    No matter what your project is, our team is staffed with IT professionals with
                                    hands-on experience who are ready to help
                                </p>
                            </div>
                            <div class="col-md-6" data-aos="fade-up" data-aos-delay="200">
                                <i class="bx bx-cube-alt"></i>
                                <h4>cross-platform experiences</h4>
                                <p>
                                    Holisticly empower premium architectures without value-added ideas. Seamlessly
                                    evolve cross-platform experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <section id="services" class="services section-bg">
            <div class="container">

                <div class="section-title" data-aos="fade-up">
                    <h2>Services</h2>
                    <p>Check out the great services we offer</p>
                </div>

                <div class="row">
                    <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
                        <div class="icon-box">
                            <div class="icon"><i class="icofont-web" style="display: inline-block;"></i></div>
                            <h4 class="title"><a href="">websites development</a></h4>
                            <p class="description">
                                Develop websites in the best ways and systems that meet your business needs in safe ways
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="200">
                        <div class="icon-box">
                            <div class="icon"><i class="icofont-brand-appstore" style="display: inline-block;"></i>
                            </div>
                            <h4 class="title"><a href="">Apps development</a></h4>
                            <p class="description">
                                Develop customized mobile applications by Android and iOS developers with high
                                efficiency
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="300">
                        <div class="icon-box">
                            <div class="icon"><i class="bx bx-desktop" style="display: inline-block;"></i></div>
                            <h4 class="title"><a href="">Graphic Design</a></h4>
                            <p class="description">
                                Make your work look more beautiful and suitable to satisfy your customers
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="400">
                        <div class="icon-box">
                            <div class="icon"><i class="icofont-architecture-alt" style="display: inline-block;"></i>
                            </div>
                            <h4 class="title"><a href="">Technical solutions</a></h4>
                            <p class="description">
                                Customized IT solutions that build on your existing business and IT infrastructure.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
        <!--=======Portfolio Section=======-->
        <section id="portfolio" class="portfolio">
            <div class="container">

                <div class="section-title" data-aos="fade-up">
                    <h2>Portfolio</h2>
                    <p>Check out our beautifull portfolio</p>
                </div>

                <div class="row" data-aos="fade-up" data-aos-delay="100">
                    <div class="col-lg-12">
                        <ul id="portfolio-flters">
                            <li data-filter="*" class="filter-active">All</li>
                            <li data-filter=".filter-web">Web</li>
                            <li data-filter=".filter-app">App</li>
                            {{-- <li data-filter=".filter-card">Design</li> --}}
                        </ul>
                    </div>
                </div>

                <div class="row portfolio-container" data-aos="fade-up" data-aos-delay="200">

                    <div class="col-lg-4 col-md-6 portfolio-item filter-app">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-1.jpg" class="img-fluid text-center"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                <a href="https://onelink.to/zf7dbr" target="_blank" title="More Details"><i
                                        class="icofont-link"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>Deli pizza</h4>
                                <p>App</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-6 portfolio-item filter-web">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-2.jpg" class="img-fluid"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                <a href="http://abayalotus.com.om/" target="_blank" title="More Details"><i
                                        class="icofont-link"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>Abaya Lotus</h4>
                                <p>Web</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-6 portfolio-item filter-app">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-6.jpg" class="img-fluid"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                <a href="https://play.google.com/store/apps/details?id=com.qurbiServices.user"
                                    title="More Details" target="_blank"><i class="icofont-link"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>khadamat-services</h4>
                                <p>App</p>
                            </div>
                        </div>
                    </div>

                    {{-- <div class="col-lg-4 col-md-6 portfolio-item filter-card">
                    <div class="portfolio-wrap">
                        <img src="assets/img/portfolio/portfolio-4.jpg" class="img-fluid" alt="">
                        <div class="portfolio-links">
                            <a href="#" title="More Details" target="_blank"><i class="icofont-link"></i></a>
                        </div>
                        <div class="portfolio-info">
                            <h4>Card 2</h4>
                            <p>Card</p>
                        </div>
                    </div>
                </div> --}}



                    <div class="col-lg-4 col-md-6 portfolio-item filter-app">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-3.jpg" class="img-fluid"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                <a href="http://abayalotus.com.om/" title="More Details" target="_blank"><i
                                        class="icofont-link"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>Abaya Lotus</h4>
                                <p>App</p>
                            </div>
                        </div>
                    </div>


                    <div class="col-lg-4 col-md-6 portfolio-item filter-web">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-5.jpg" class="img-fluid"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                <a href="https://system.smart-hr.top/" target="_blank" title="More Details"><i
                                        class="icofont-link"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>SMART ERP</h4>
                                <p>Web</p>
                            </div>
                        </div>
                    </div>


                    {{-- <div class="col-lg-4 col-md-6 portfolio-item filter-card">
                    <div class="portfolio-wrap">
                        <img src="assets/img/portfolio/portfolio-7.jpg" class="img-fluid" alt="">
                        <div class="portfolio-links">
                            <a href="#" title="More Details" target="_blank"><i class="icofont-link"></i></a>
                        </div>
                        <div class="portfolio-info">
                            <h4>Card 1</h4>
                            <p>Card</p>
                        </div>
                    </div>
                </div> --}}

                    {{-- <div class="col-lg-4 col-md-6 portfolio-item filter-card">
                    <div class="portfolio-wrap">
                        <img src="assets/img/portfolio/portfolio-8.jpg" class="img-fluid" alt="">
                        <div class="portfolio-links">
                            <a href="#" title="More Details" target="_blank"><i class="icofont-link"></i></a>
                        </div>
                        <div class="portfolio-info">
                            <h4>Card 3</h4>
                            <p>Card</p>
                        </div>
                    </div>
                </div> --}}

                    <div class="col-lg-4 col-md-6 portfolio-item filter-web">
                        <div class="portfolio-wrap">
                            <img src="assets/img/portfolio/portfolio-9.jpg" class="img-fluid"
                                style="height:262.500px !important;">
                            <div class="portfolio-links">
                                {{-- <a href="assets/img/portfolio/portfolio-9.jpg" data-gall="portfolioGallery"
                                    class="venobox" title="Web 3"><i class="icofont-plus-circle"></i></a> --}}
                                <a href="https://zakatsadah.om/" title="More Details"><i class="icofont-link"
                                        target="_blank"></i></a>
                            </div>
                            <div class="portfolio-info">
                                <h4>لجنة الزكاة والصدقات بولاية سدح </h4>
                                <p>Web</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section><!-- End Portfolio Section -->

        <!-- ======= F.A.Q Section ======= -->
        {{-- <section id="faq" class="faq section-bg">
            <div class="container">
                <div class="section-title" data-aos="fade-up">
                    <h2>F.A.Q</h2>
                    <p>Frequently Asked Questions</p>
                </div>

                <ul class="faq-list">

                    <li data-aos="fade-up" data-aos-delay="100">
                        <a data-toggle="collapse" class="" href="#faq1">Non consectetur a erat nam at
                            lectus
                            urna duis? <i class="icofont-simple-up"></i></a>
                        <div id="faq1" class="collapse show" data-parent=".faq-list">
                            <p>
                                Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet
                                non
                                curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor
                                purus
                                non.
                            </p>
                        </div>
                    </li>

                    <li data-aos="fade-up" data-aos-delay="200">
                        <a data-toggle="collapse" href="#faq2" class="collapsed">Feugiat scelerisque varius
                            morbi
                            enim nunc faucibus a pellentesque? <i class="icofont-simple-up"></i></a>
                        <div id="faq2" class="collapse" data-parent=".faq-list">
                            <p>
                                Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum
                                velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend
                                donec
                                pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus
                                turpis massa tincidunt dui.
                            </p>
                        </div>
                    </li>

                    <li data-aos="fade-up" data-aos-delay="300">
                        <a data-toggle="collapse" href="#faq3" class="collapsed">Dolor sit amet consectetur
                            adipiscing elit pellentesque habitant morbi? <i class="icofont-simple-up"></i></a>
                        <div id="faq3" class="collapse" data-parent=".faq-list">
                            <p>
                                Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus
                                pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit.
                                Rutrum
                                tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna
                                molestie at elementum eu facilisis sed odio morbi quis
                            </p>
                        </div>
                    </li>

                    <li data-aos="fade-up" data-aos-delay="400">
                        <a data-toggle="collapse" href="#faq4" class="collapsed">Ac odio tempor orci dapibus.
                            Aliquam eleifend mi in nulla? <i class="icofont-simple-up"></i></a>
                        <div id="faq4" class="collapse" data-parent=".faq-list">
                            <p>
                                Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum
                                velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend
                                donec
                                pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus
                                turpis massa tincidunt dui.
                            </p>
                        </div>
                    </li>

                    <li data-aos="fade-up" data-aos-delay="500">
                        <a data-toggle="collapse" href="#faq5" class="collapsed">Tempus quam pellentesque nec
                            nam
                            aliquam sem et tortor consequat? <i class="icofont-simple-up"></i></a>
                        <div id="faq5" class="collapse" data-parent=".faq-list">
                            <p>
                                Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in
                                est
                                ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit
                                adipiscing bibendum est. Purus gravida quis blandit turpis cursus in
                            </p>
                        </div>
                    </li>

                    <li data-aos="fade-up" data-aos-delay="600">
                        <a data-toggle="collapse" href="#faq6" class="collapsed">Tortor vitae purus faucibus
                            ornare. Varius vel pharetra vel turpis nunc eget lorem dolor? <i
                                class="icofont-simple-up"></i></a>
                        <div id="faq6" class="collapse" data-parent=".faq-list">
                            <p>
                                Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae ultricies leo
                                integer malesuada nunc vel. Tincidunt eget nullam non nisi est sit amet. Turpis nunc
                                eget lorem dolor sed. Ut venenatis tellus in metus vulputate eu scelerisque.
                                Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus.
                                Nibh tellus molestie nunc non blandit massa enim nec.
                            </p>
                        </div>
                    </li>

                </ul>

            </div>
        </section> --}}
        <!-- End F.A.Q Section -->

        <!-- ======= Team Section ======= -->
        <section id="team" class="team section-bg">
            <div class="container">

                <div class="section-title" data-aos="fade-up">
                    <h2>Team</h2>
                    <p>Our team is always here to help</p>
                </div>

                <div class="row">

                    <div class="col-xl-3 col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="100">
                        <div class="member">
                            <img src="assets/img/team/team-6.jpg" class="img-fluid" alt="">
                            <div class="member-info">
                                <div class="member-info-content">
                                    <h4>Dr. Saleh Al-Khaldi</h4>
                                    <span>Chief Executive Officer</span>
                                </div>
                                <div class="social">
                                    <a href="" target="_blank"><i class="icofont-twitter"></i></a>
                                    <a href="" target="_blank"><i class="icofont-facebook"></i></a>
                                    <a href="" target="_blank"><i class="icofont-instagram"></i></a>
                                    <a href="https://www.linkedin.com/in/dr-saleh-al-khaldi-192071b/" target="_blank"><i
                                            class="icofont-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="200">
                        <div class="member">
                            <img src="assets/img/team/team-5.jpg" class="img-fluid" style="height: 255px !important;">
                            <div class="member-info">
                                <div class="member-info-content">
                                    <h4>Ahmed Almufarji</h4>
                                    <span>Executive Manager</span>
                                </div>
                                <div class="social">
                                    <a href="" target="_blank"><i class="icofont-twitter"></i></a>
                                    <a href="" target="_blank"><i class="icofont-facebook"></i></a>
                                    <a href="" target="_blank"><i class="icofont-instagram"></i></a>
                                    <a href="https://www.linkedin.com/in/ahmedalmufarji/" target="_blank"><i
                                            class="icofont-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="300">
                        <div class="member">
                            <img src="assets/img/team/team-3.jpg" class="img-fluid" alt="">
                            <div class="member-info">
                                <div class="member-info-content">
                                    <h4>William Anderson</h4>
                                    <span>CTO</span>
                                </div>
                                <div class="social">
                                    <a href=""><i class="icofont-twitter"></i></a>
                                    <a href=""><i class="icofont-facebook"></i></a>
                                    <a href=""><i class="icofont-instagram"></i></a>
                                    <a href=""><i class="icofont-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="400">
                        <div class="member">
                            <img src="assets/img/team/team-4.jpg" class="img-fluid" alt="">
                            <div class="member-info">
                                <div class="member-info-content">
                                    <h4>Amanda Jepson</h4>
                                    <span>Accountant</span>
                                </div>
                                <div class="social">
                                    <a href=""><i class="icofont-twitter"></i></a>
                                    <a href=""><i class="icofont-facebook"></i></a>
                                    <a href=""><i class="icofont-instagram"></i></a>
                                    <a href=""><i class="icofont-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section><!-- End Team Section -->

        <!-- ======= Clients Section ======= -->
        <section id="clients" class="clients">
            <div class="container">

                <div class="section-title" data-aos="fade-up">
                    <h2>Clients</h2>
                    <p>They trusted us</p>
                </div>

                <div class="owl-carousel clients-carousel" data-aos="fade-up" data-aos-delay="100">
                    <img src="assets/img/clients/client-1.png" alt="">
                    <img src="assets/img/clients/client-2.png" alt="">
                    <img src="assets/img/clients/client-10.png" alt="" style="height: 70px">
                    <img src="assets/img/clients/client-3.png" alt="">
                    <img src="assets/img/clients/client-4.png" alt="">
                    <img src="assets/img/clients/client-9.png" alt="" style="height: 70px">
                    <img src="assets/img/clients/client-5.png" alt="">
                    <img src="assets/img/clients/client-6.png" alt="">
                    <img src="assets/img/clients/client-11.png" alt="" style="height: 70px">
                    <img src="assets/img/clients/client-7.png" alt="">
                    <img src="assets/img/clients/client-8.png" alt="">
                </div>

            </div>
        </section><!-- End Clients Section -->

        <!-- ======= Contact Us Section ======= -->
        <section id="contact" class="contact section-bg">
            <div class="container">
                <div class="section-title" data-aos="fade-up">
                    <h2>Contact Us</h2>
                    <p>Contact us the get started</p>
                </div>

                <div class="row">

                    <div class="col-lg-5 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="100">
                        <div class="info">
                            <div class="address">
                                <i class="icofont-google-map"></i>
                                <h4>Location:</h4>
                                <p>Muscat, Oman</p>
                            </div>

                            <div class="email">
                                <i class="icofont-envelope"></i>
                                <h4>Email:</h4>
                                <p>info@MuscatApps.com</p>
                            </div>

                            <div class="phone">
                                <i class="icofont-phone"></i>
                                <h4>Call:</h4>
                                <p>+968 9882 9882</p>
                            </div>

                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61600.517810785124!2d58.43690570651346!3d23.597088103629105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e91ffc336755021%3A0x44f503824b7cd270!2z2KfZhNi62KjYsdipINin2YTYrNmG2YjYqNmK2KnYjCDZhdiz2YLYt9iMINi52YXYp9mG!5e0!3m2!1sar!2snl!4v1660228185707!5m2!1sar!2snl"
                                frameborder="0" style="border:0; width: 100%; height: 290px;" allowfullscreen></iframe>


                        </div>

                    </div>

                    <div class="col-lg-7 mt-5 mt-lg-0 d-flex align-items-stretch" data-aos="fade-up"
                        data-aos-delay="200">
                        <form action="{{ route('Contact') }}" method="post" class="php-email-form">
                            @csrf
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="name">Your Name</label>
                                    <input type="text" name="name" class="form-control" id="name"
                                        data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                                    <div class="validate"></div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="name">Your Email</label>
                                    <input type="email" class="form-control" name="email" id="email"
                                        data-rule="email" data-msg="Please enter a valid email" />
                                    <div class="validate"></div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="name">Subject</label>
                                <input type="text" class="form-control" name="subject" id="subject"
                                    data-rule="minlen:4" data-msg="Please enter at least 8 chars of subject" />
                                <div class="validate"></div>
                            </div>
                            <div class="form-group">
                                <label for="name">Message</label>
                                <textarea class="form-control" name="message" rows="10" data-rule="required"
                                    data-msg="Please write something for us"></textarea>
                                <div class="validate"></div>
                            </div>
                            <div class="mb-3">
                                <div class="loading">Loading</div>
                                <div class="error-message"></div>
                                <div class="sent-message">Your message has been sent. Thank you!</div>
                            </div>
                            <div class="text-center"><button type="submit">Send Message</button></div>
                        </form>
                    </div>

                </div>

            </div>
        </section>
    </main>
@endsection
