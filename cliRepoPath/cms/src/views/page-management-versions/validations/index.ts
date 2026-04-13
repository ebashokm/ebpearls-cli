import * as Yup from 'yup';

// Custom method to validate ReactQuill content
const validateContent = (value) => {
    // Quill uses <p><br></p> to represent an empty editor, so we check for this
    const isEmptyContent = !value || value === '<p><br></p>';
    if (isEmptyContent) {
      return false; // Fail validation
    }
    return true; // Pass validation
  };

export const pageValidationSchema = Yup.object().shape({
    pageType: Yup.string().trim().required().label('Page type'),
    version: Yup.string().trim().max(5, 'Page version must be numbers from 1-9 and period . only. Max character is 5')
    .matches(/^\d+(\.\d+)*$/, 'Page version must be numbers from 1-9 and period . only')
    .required('Page version is required')
    .label('Page version'),
    title: Yup.string().min(3).max(30).trim().required().label('Title'),
    status: Yup.string().trim().required().label('Status'),
    slug: Yup.string().trim().required().label('Slug'),
    seoTags: Yup.object().shape({
        title: Yup.string().max(50).trim().optional().label('Seo title'),
        tags: Yup.string().max(300).trim().optional().label('Seo tags'),
        description: Yup.string().max(500).trim().optional().label('Seo description'),
    }),
    content: Yup.string()
    .trim()
    .test('content', 'Content description cannot be empty', (value) => validateContent(value)) // Custom content validation
    .required()
    .label('Content description'),
});
