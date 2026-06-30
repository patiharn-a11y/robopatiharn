# Login Functionality Test Plan

## Application Overview

The Robowealth IIC Portal is a web application that requires user authentication. The login page provides username/email and password fields, along with a "Keep Me Signed In" option and a "Login with Line" button. This test plan covers comprehensive testing of the login functionality including happy path scenarios, error handling, validation, and edge cases to ensure a robust authentication experience.

## Test Scenarios

### 1. Login Functionality

**Seed:** `tests/example.spec.ts`

#### 1.1. Successful Login with Valid Credentials

**File:** `tests/login/successful-login.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads with title 'Robowealth IIC Portal'
    - expect: The Sign in form is visible with Username and Password fields
    - expect: The Sign In button is enabled and clickable
  2. Enter valid username 'admin@robowealth.co.th' in the Username field
    - expect: The username field contains the entered text
    - expect: The cursor remains in the field ready for next input
  3. Enter valid password 'C@4*&pjMSuEF56Na' in the Password field
    - expect: The password text is masked (displayed as dots or asterisks)
    - expect: The password field contains the entered characters
  4. Verify the 'Keep Me Signed In' checkbox is checked (default state)
    - expect: The checkbox displays as checked by default
  5. Click the Sign In button
    - expect: The button shows a loading state (disabled or spinner visible)
    - expect: The page redirects to the dashboard or main application page
    - expect: No error message is displayed
    - expect: User authentication is successful

#### 1.2. Login with Invalid Username

**File:** `tests/login/invalid-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter an invalid username 'invalid.user@example.com' in the Username field
    - expect: The username field contains the entered text
  3. Enter any password in the Password field
    - expect: The password field is filled with masked text
  4. Click the Sign In button
    - expect: An error message 'Invalid username or password' is displayed
    - expect: The user remains on the login page
    - expect: The error message does not specify whether the username or password is incorrect (for security)
    - expect: The Username and Password fields retain their values for correction

#### 1.3. Login with Invalid Password

**File:** `tests/login/invalid-password.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter a valid username 'admin@robowealth.co.th' in the Username field
    - expect: The username field contains the correct text
  3. Enter an incorrect password 'WrongPassword123' in the Password field
    - expect: The password field displays masked text
  4. Click the Sign In button
    - expect: An error message 'Invalid username or password' is displayed
    - expect: The user remains on the login page
    - expect: The credentials are not processed further for security reasons
    - expect: The Username and Password fields retain their values

#### 1.4. Login with Empty Username Field

**File:** `tests/login/empty-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Leave the Username field empty
    - expect: The Username field is empty and ready for input
  3. Enter a valid password in the Password field
    - expect: The password field displays masked text
  4. Click the Sign In button
    - expect: An error message 'Invalid username or password' is displayed
    - expect: The user remains on the login page
    - expect: No successful authentication occurs
  5. Verify the error message does not distinguish between empty username and missing password
    - expect: The error message is generic for security purposes

#### 1.5. Login with Empty Password Field

**File:** `tests/login/empty-password.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter a valid username 'admin@robowealth.co.th' in the Username field
    - expect: The username field contains the entered text
  3. Leave the Password field empty
    - expect: The Password field is empty and awaiting input
  4. Click the Sign In button
    - expect: An error message 'Invalid username or password' is displayed
    - expect: The user remains on the login page
    - expect: No authentication attempt is processed

#### 1.6. Login with Both Fields Empty

**File:** `tests/login/empty-both-fields.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Ensure both Username and Password fields are empty
    - expect: Both fields are empty by default
  3. Click the Sign In button directly without entering any credentials
    - expect: An error message 'Invalid username or password' is displayed
    - expect: The page remains on the login form
    - expect: The error message prevents batch account brute-force attacks by not distinguishing between field-level validation errors

#### 1.7. Keep Me Signed In Checkbox Functionality

**File:** `tests/login/keep-me-signed-in.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
    - expect: The 'Keep Me Signed In' checkbox is checked by default
  2. Click the 'Keep Me Signed In' checkbox to uncheck it
    - expect: The checkbox state changes to unchecked
    - expect: The UI updates to reflect the unchecked state
  3. Enter valid username 'admin@robowealth.co.th' and password 'C@4*&pjMSuEF56Na'
    - expect: Both fields are populated with valid credentials
  4. Click the Sign In button with checkbox unchecked
    - expect: User is successfully logged in if credentials are correct
    - expect: Session cookie/token is created without the extended session timeout
  5. Navigate to https://iicportal-dev.robodev.co/login again
    - expect: Verify that session behavior differs from login with checked 'Keep Me Signed In'
    - expect: The difference should be observable in session timeout behavior (may require separate test)

#### 1.8. Keep Me Signed In Checkbox Default State

**File:** `tests/login/keep-me-signed-in-default.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The page loads the login form
  2. Observe the 'Keep Me Signed In' checkbox before any interaction
    - expect: The checkbox is checked by default
    - expect: The checkbox is visually distinct and clearly labeled
  3. Enter valid credentials and submit the form with the checkbox checked
    - expect: User is logged in successfully
    - expect: The session is configured to persist across browser restarts (longer timeout)

#### 1.9. Password Field Masking

**File:** `tests/login/password-masking.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login form is visible
  2. Click on the Password field
    - expect: The field is focused and ready for input
  3. Type a password slowly to observe each character as it's entered: 'Test123!'
    - expect: Each character is masked immediately (displayed as dots/asterisks)
    - expect: The actual text is not visible for security
    - expect: The masked characters are consistent for each input

#### 1.10. Login with Line Button Visibility

**File:** `tests/login/login-with-line-button.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Observe the 'Login with Line' button
    - expect: The button is visible on the page
    - expect: The button displays the Line login branding/icon correctly
    - expect: The button is either disabled or ready to redirect to Line OAuth flow
  3. Check if the button is disabled or enabled
    - expect: Document whether the button is currently enabled or disabled for future testing of OAuth flow

#### 1.11. Form Field Labels and Placeholders

**File:** `tests/login/field-labels.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login form is visible
  2. Inspect the Username field label and any placeholder text
    - expect: The field has a clear label 'Username'
    - expect: If a placeholder exists, it provides helpful context (e.g., 'Enter your email')
  3. Inspect the Password field label and any placeholder text
    - expect: The field has a clear label 'Password'
    - expect: Placeholder text is present if helpful
  4. Verify all form elements have appropriate labels for accessibility
    - expect: Labels are properly associated with their input fields
    - expect: Screen readers can read the labels correctly

#### 1.12. Page Title and Heading Verification

**File:** `tests/login/page-structure.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The page title is 'Robowealth IIC Portal'
    - expect: The main heading displays 'Sign in'
    - expect: The subheading displays 'Sign in to your account to start using IIC Portal'
  2. Verify the page logo or branding link
    - expect: A logo/branding element is visible linking back to the home page
    - expect: The branding is recognizable and professional

#### 1.13. Copyright and Footer Information

**File:** `tests/login/footer-info.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Scroll down or observe the footer
    - expect: Copyright text 'Copyright 2026, Robowealth Co., Ltd. All Rights Reserved.' is visible
    - expect: Footer is properly positioned at the bottom of the page

#### 1.14. Multiple Invalid Login Attempts

**File:** `tests/login/multiple-invalid-attempts.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Attempt login with invalid credentials 'test1@example.com' and 'WrongPass1'
    - expect: Error message 'Invalid username or password' is displayed
  3. Attempt login again with different invalid credentials 'test2@example.com' and 'WrongPass2'
    - expect: Error message is displayed again
  4. Attempt login a third time with different invalid credentials
    - expect: Error message is displayed
    - expect: No rate limiting or account lockout is triggered immediately (verify security policies)

#### 1.15. Whitespace Handling in Username Field

**File:** `tests/login/whitespace-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter username with leading/trailing spaces: '  admin@robowealth.co.th  ' in the Username field
    - expect: The spaces are entered in the field
  3. Enter a valid password
    - expect: The password field is populated
  4. Click the Sign In button
    - expect: The system either trims whitespace and logs in successfully, or rejects with error message
    - expect: Behavior should be consistent and documented

#### 1.16. Case Sensitivity of Username Field

**File:** `tests/login/case-sensitivity-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter username in different case: 'ADMIN@ROBOWEALTH.CO.TH' in the Username field
    - expect: The username is entered as typed
  3. Enter a valid password 'C@4*&pjMSuEF56Na'
    - expect: The password field is populated
  4. Click the Sign In button
    - expect: Determine if the system treats usernames as case-insensitive (e.g., admin@robowealth.co.th == ADMIN@ROBOWEALTH.CO.TH)
    - expect: Document the behavior for consistency

#### 1.17. Special Characters in Username

**File:** `tests/login/special-chars-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter username with special characters: 'test+1@robowealth.co.th' in the Username field
    - expect: The system accepts the input with special characters
  3. Enter a valid password
    - expect: The password field is populated
  4. Click the Sign In button
    - expect: The system processes the special characters correctly if the username exists
    - expect: Error message is displayed if the username does not exist

#### 1.18. Very Long Password Input

**File:** `tests/login/long-password.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Enter a very long string of characters in the Password field (e.g., 100+ characters)
    - expect: The field accepts the input without breaking
    - expect: All characters are masked
  3. Enter a valid username
    - expect: The username field is populated
  4. Click the Sign In button
    - expect: The system either validates the password correctly or returns an error
    - expect: No field overflow or visual distortion occurs
  5. Verify the password field has a reasonable character limit
    - expect: The field either enforces a maximum length or accepts very long passwords
    - expect: Behavior is consistent with system requirements

#### 1.19. Browser Back Button After Login

**File:** `tests/login/back-button-after-login.spec.ts`

**Steps:**
  1. Login successfully with valid credentials 'admin@robowealth.co.th' and 'C@4*&pjMSuEF56Na'
    - expect: User is redirected to the dashboard/main page
  2. Click the browser back button
    - expect: The browser navigates back to the previous page (login page or referrer)
  3. Observe the login form state
    - expect: The form is empty (credentials are not re-displayed for security)
    - expect: The user may need to log in again if the session is not established

#### 1.20. Tab Key Navigation Through Form

**File:** `tests/login/tab-navigation.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Press Tab key from the page start
    - expect: Focus moves to the first interactive element (likely the Logo link)
  3. Press Tab key repeatedly to navigate through form elements: Logo -> Username -> Password -> Checkbox -> Sign In button
    - expect: Focus order is logical and follows the visual layout
    - expect: Each element receives focus in the correct sequence
  4. Verify focus is visible for each element (outline or highlight)
    - expect: Keyboard navigation is accessible and visible

#### 1.21. Enter Key Submission from Username Field

**File:** `tests/login/enter-key-username.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Click on the Username field and enter 'admin@robowealth.co.th'
    - expect: The username is entered correctly
  3. Press Enter key from the Username field without moving to Password field
    - expect: Focus either moves to the Password field, or the form is not submitted
  4. Verify the form does not submit until all fields are filled
    - expect: The Enter key behavior is consistent with form design

#### 1.22. Enter Key Submission from Password Field

**File:** `tests/login/enter-key-password.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Fill in valid username 'admin@robowealth.co.th' in the Username field
    - expect: The username is entered correctly
  3. Click on the Password field and enter valid password 'C@4*&pjMSuEF56Na'
    - expect: The password is entered and masked
  4. Press Enter key from the Password field instead of clicking Sign In button
    - expect: The form is submitted and login is processed
    - expect: This is a convenient UX feature for keyboard users
  5. Verify successful login occurs
    - expect: User is redirected to the dashboard if credentials are valid

#### 1.23. Accessibility - Screen Reader Compatibility

**File:** `tests/login/accessibility-screen-reader.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login with accessibility inspection enabled
    - expect: All form labels are properly associated with input fields
  2. Verify Username field has proper aria-label or label element
    - expect: Screen reader announces 'Username' when field is focused
  3. Verify Password field has proper aria-label or label element
    - expect: Screen reader announces 'Password' when field is focused
  4. Verify the Sign In button is announced correctly
    - expect: Screen reader announces 'Sign In button' or similar
  5. Verify error messages are announced to screen readers
    - expect: Error message 'Invalid username or password' is programmatically associated with the form

#### 1.24. Accessibility - Color Contrast

**File:** `tests/login/accessibility-color-contrast.spec.ts`

**Steps:**
  1. Navigate to https://iicportal-dev.robodev.co/login
    - expect: The login page loads successfully
  2. Verify text color contrast for all elements (labels, buttons, error messages)
    - expect: All text meets WCAG AA standard for color contrast (minimum 4.5:1 for normal text)
  3. Verify the Sign In button color contrast
    - expect: The button text is clearly visible against the button background
  4. Verify error message color contrast
    - expect: Error message text is readable and not solely reliant on color to convey information
