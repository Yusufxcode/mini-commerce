# Mini Commerce - E-commerce Application

## Overview

Mini Commerce is a modern, responsive e-commerce application built with Angular 19. It provides a clean, user-friendly interface for browsing products, managing shopping carts, and viewing detailed product information. The application uses a standalone component architecture and follows modern Angular best practices.

## Design approach
- Products are loaded from a JSON file (`/assets/data/products.json`)
- Loading screen for better user experience
- Data is cached in localStorage for performance
- ProductService provides observables for reactive data binding
- Components subscribe to product streams for real-time updates
- All components survives reload
- Lint and unit testing intact
- Theme color for mobile browsers

## Tools & techniques
- **Angular 19**: Core framework with standalone components
- **TypeScript 5.8**: Strong typing and modern JavaScript features
- **RxJS 7.8**: Reactive programming for data streams and state management
- **ngx-toastr**: UI feedback components/toasts.
- **Angular CLI**: Build tooling and development server
- **ESLint** Linting test passed successfully for the project
- **karma-jasmine** Unit test passed successfully

- ## SEO strategy
- SEO-friendly URLs with product IDs
- Meta tags for better SEO
- Meta tags for easy social media sharing
- Preconnect to external resources

- ## Error-handling technique
- Global error interceptor
- Logging of errors
- Route error return to default

- ## tsconfig & ESLint configs
- **ESLint** Linting test passed
- Strict typescript - no anys
- Effective clean code and commits
- Modern Angular best practices






