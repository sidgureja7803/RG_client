# Resume Generator Client

This is the client-side application for the Resume Generator platform. It provides a user interface for creating, analyzing, and managing resumes.

## Features

- Create and customize resumes using templates or code editor
- Analyze resumes against job descriptions for matching scores
- Calculate ATS compatibility scores
- Markdown-based resume editor with live preview
- Export resumes to PDF

## Setup Instructions

### Prerequisites

- Node.js (v16.x or higher)
- Server component running (see server directory)

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## Using the Resume Analyzer

1. Navigate to the Analyzer page (http://localhost:5173/analyzer)
2. Upload your resume (supported formats: PDF, DOC, DOCX, TXT)
3. Paste the job description in the text area
4. Click "Analyze Match" to get results
5. View your match score, ATS compatibility, and recommendations

## Troubleshooting

### Resume Analysis Not Working

If the resume analysis feature is not working:

1. Check that the server component is running
2. Ensure the API URL is correctly configured in your `.env` file
3. Verify that your server has a valid Gemini API key configured
4. Check browser console for any error messages

### Markdown Editor Issues

If the code-based resume editor is not functioning correctly:

1. Ensure all dependencies are installed
2. Try clearing your browser cache
3. Check for JavaScript console errors

## Development

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

## License

[MIT](LICENSE)