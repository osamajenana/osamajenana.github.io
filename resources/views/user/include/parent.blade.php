<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Muscat Apps</title>
    <meta content="" name="descriptison">
    <meta content="" name="keywords">
    <link href="{{ asset('assets/img/favicon.png') }}" rel="icon">
    <link
        href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,600,600i,700,700i"
        rel="stylesheet">
    <link href="{{ asset('assets/vendor/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/icofont/icofont.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/boxicons/css/boxicons.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/venobox/venobox.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/owl.carousel/assets/owl.carousel.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/vendor/aos/aos.css') }}" rel="stylesheet">
    @if (app()->getLocale() == 'en')
        <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    @else
        <link href="{{ asset('assets/css/style_ar.css') }}" rel="stylesheet">
    @endif
</head>

<body>
    <header id="header" class="fixed-top">
        <div class="container-fluid d-flex">
            @if (app()->getLocale() === 'en')
                <div class="logo mr-auto">
                    <h1 class="text-light"><a href="{{ route('index') }}"><span>Muscat Apps</span></a></h1>
                </div>
                <nav class="nav-menu d-none d-lg-block">
                    <ul>
                        <li class="active"><a href="#header">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#team">Team</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                        {{-- <li>
                            @if (app()->getLocale() === 'en')
                                <a href="{{ asset('/ar') }}">
                                    العربية
                                </a>
                            @else
                                <a href="{{ asset('/en') }}">
                                    English
                                </a>
                            @endif
                        </li> --}}
                    </ul>
                </nav>
            @else
                <div class="logo">
                    <h1 class="text-light"><a href="{{ route('index') }}"><span>مسقط آبز</span></a></h1>
                </div>
                <nav class="nav-menu d-none d-lg-block mr-auto">
                    <ul>
                        {{-- <li>
                            @if (app()->getLocale() === 'en')
                                <a href="{{ asset('/ar') }}">
                                    العربية
                                </a>
                            @else
                                <a href="{{ asset('/en') }}">
                                    English
                                </a>
                            @endif
                        </li> --}}

                        <li><a href="#contact">تواصل معنا</a></li>
                        <li><a href="#team">الفريق</a></li>
                        <li><a href="#portfolio">معرض الاعمال</a></li>
                        <li><a href="#services">خدماتنا</a></li>
                        <li><a href="#about">من نحن</a></li>
                        <li class="active"><a href="#header">الرئيسية</a></li>
                       
                    </ul>
                </nav>
            @endif


        </div>
    </header>


    @yield('contant')

    <!-- ======= Footer ======= -->
    <footer id="footer">
        <div class="footer-top">
            <div class="container">
                <div class="row">

                    <div class="col-lg-3 col-md-6 footer-contact" data-aos="fade-up" data-aos-delay="100">
                        <h3>Muscat Apps</h3>
                        <p>
                            A108 Adam Street <br>
                            New York, NY 535022<br>
                            United States <br><br>
                            <strong>Phone:</strong> +968 9882 9882<br>
                            <strong>Email:</strong> info@MuscatApps.com<br>
                        </p>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links" data-aos="fade-up" data-aos-delay="200">
                        <h4>Useful Links</h4>
                        <ul>
                            <li><i class="bx bx-chevron-right"></i> <a href="#header">Home</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#about">About us</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Services</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">Terms of service</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#">Privacy policy</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links" data-aos="fade-up" data-aos-delay="300">
                        <h4>Our Services</h4>
                        <ul>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Web Design</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Web Development</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Product Management</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Marketing</a></li>
                            <li><i class="bx bx-chevron-right"></i> <a href="#services">Graphic Design</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links" data-aos="fade-up" data-aos-delay="400">
                        <h4>Our Social Networks</h4>
                        <div class="social-links mt-3">
                            <a href="https://twitter.com/muscatapps?lang=en" class="twitter" target="_blank"><i
                                    class="bx bxl-twitter"></i></a>
                            <a href="https://www.facebook.com/MuscatApps/" class="facebook" target="_blank"><i
                                    class="bx bxl-facebook"></i></a>
                            <a href="https://www.instagram.com/muscatapps5/" class="instagram" target="_blank"><i
                                    class="bx bxl-instagram"></i></a>
                            <a href="https://www.linkedin.com/company/muscatapps/" target="_blank"
                                class="linkedin"><i class="bx bxl-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="copyright">
                &copy; Copyright <strong><span>Muscat Apps</span></strong>. All Rights Reserved
            </div>
            <div class="credits">
                Designed by <a href="/">Muscat Apps Teams</a>
            </div>
        </div>
    </footer>
    <a href="#" class="back-to-top"><i class="icofont-simple-up"></i></a>
    <script src="{{ asset('assets/vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap/js/bootstrap.bundle.min.j') }}s"></script>
    <script src="{{ asset('assets/vendor/jquery.easing/jquery.easing.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/php-email-form/validate.js') }}"></script>
    <script src="{{ asset('assets/vendor/isotope-layout/isotope.pkgd.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/venobox/venobox.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/owl.carousel/owl.carousel.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/aos/aos.js') }}"></script>
    <script src="{{ asset('assets/js/main.js') }}"></script>
</body>

</html>
