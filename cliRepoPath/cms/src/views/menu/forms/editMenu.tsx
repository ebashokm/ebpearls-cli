import React, { useEffect, useState } from 'react';
import {
    Divider,
    Typography,
    Button,
    Modal,
    Grid,
    FormControl,
    FormHelperText,
    MenuItem,
    FormLabel,
    IconButton,
    TextField,
    InputLabel,
    Select,
    CircularProgress,
    Stack,
    Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import useSnackbar from 'hooks/common/useSnackbar';
import useGQL from '../hooks/useGQL';

import {
    defaultValueMenuItem,
    iconTypeSelectOptions,
    linkTypeSelectOptions,
    defaultImageConfig,
    validationSchema,
    validationSchemaMenuItem,
    style,
    defaultFile
} from '../constants/menu';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import DragDrop from 'views/menu/components/dnd/DragDrop';
import { v4 as uuid } from 'uuid';
import { uploadFile } from 'utils/imageUploads';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { ImageWrapper, IconButtonWrapper } from 'views/menu/components/formik/formik.styles';
import CloseIcon from '@mui/icons-material/Close';
import invariant from 'tiny-invariant';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SignedUrlMethod } from 'types/profile';
import { GridDivider } from 'components/divider/Divider';
import { InitialValueMenu } from '../types/menu';
import ConfirmModal from 'components/modal/ConfirmModal';
import { closeModal, openModal } from 'store/slices/modal';
import CustomLoader from 'components/loader';
import ImageCropperModal from 'components/modal/ImageCropModal';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';

const EditMenu = () => {
    const params = useParams();

    const theme = useTheme();
    const [mnData, setMnData] = useState<any>();
    const [menuItemArray, setMenuItemArray] = useState<any>([]);

    const [defaultItem, setDefaultItem] = useState(defaultValueMenuItem);
    const [modalOpenClickedFrom, setModalOpenClickedFrom] = useState<any>();
    const [imageUrl, setImageUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageMenuLoading, setImageMenuLoading] = useState(false);
    const [image, setImage] = useState<any>(defaultFile);
    const [imageMenuUrl, setImageMenuUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const form = useSelector((state1: RootState) => state1.form);
    invariant(params.id, 'Not empty on target edit');
    const [linkSelectOptions, setLinkSelectOptions] = useState<any>([]);
    const { UPDATE_MENU, LIST_MENU, LIST_PAGES, LIST_TAXONOMIES, IMAGE_UPLOAD } = useGQL();
    const { loading: menuLoading, data: menuData, refetch } = LIST_MENU(params.id!);
    const dispatch = useDispatch();
    const [defaultValueMain, setDefaultValueMain] = useState<InitialValueMenu>({
        title: menuData?.listMenu?.menu?.title || '',
        imageAltText: menuData?.listMenu?.menu?.imageAltText || '',
        status: menuData?.listMenu?.menu?.status || '',
        menuPosition: menuData?.listMenu?.menu?.menuPosition || ''
    });
    const { data: pagesData } = LIST_PAGES({ searchText: '', orderBy: 'title', order: 'desc', limit: 100, skip: 0 });
    const { data: taxonomiesData } = LIST_TAXONOMIES({ searchText: '', orderBy: 'title', order: 'desc', limit: 100, skip: 0 });

    const [handleUpdateMenu] = UPDATE_MENU();
    const [isEdit, setIsEdit] = useState<string>('');
    const [isEditChild, setIsEditChild] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [iconValue, setIconValue] = useState<any>();
    const [imgConfig, setImgConfig] = useState<typeof defaultImageConfig>(defaultImageConfig);
    const [linkType, setLinkType] = useState<any>();
    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    //image cropper
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [croppedImage, setCroppedImage] = useState();
    const [imageType, setImageType] = useState('');

    const [subMenuOpenCropper, setSubMenuOpenCropper] = useState(false);
    const [subMenuBase64Image, setSubMenuBase64Image] = useState<any>('');
    const [subMenuCroppedImage, setSubMenuCroppedImage] = useState({});
    const [subMenuBlobImage, setSubMenuBlobImage] = useState({});
    const [subMenuImageType, setSubMenuImageType] = useState('');
    const [currentSubMenuFileName, setCurrentSubMenuFileName] = useState('');

    const [handleImageUpload] = IMAGE_UPLOAD();
    const handleOpen = (clickedFrom = {}) => {
        setOpen(true);
        setModalOpenClickedFrom(clickedFrom);
    };
    const handleClose = () => {
        setDefaultItem(defaultValueMenuItem);
        setIsEdit('');
        setIsEditChild('');
        setOpen(false);
        setIconValue('');
        setLinkType('');
    };

    const handleImageReset = () => {
        setImgConfig(defaultImageConfig);
        setIconValue('');
    };

    useEffect(() => {
        if (linkType == 'page') {
            const options = pagesData.listPages.pages
                .filter((item) => item.status == 'ACTIVE')
                .map((item) => {
                    return {
                        label: item.title,
                        value: JSON.stringify(item._id)
                    };
                });
            setLinkSelectOptions(options);
        } else if (linkType == 'taxonomy') {
            const options = taxonomiesData?.listTaxonomies?.taxonomies.map((item) => {
                return {
                    label: item.name,
                    value: JSON.stringify(item._id)
                };
            });
            console.log('options taxonomy ===>', options);
            setLinkSelectOptions(options);
        }
    }, [linkType]);

    useEffect(() => {
        refetch();
        return () => {
            sessionStorage.clear();
        };
    }, [menuData]);

    useEffect(() => {
        setImageLoading(true);
        const menuDetails = menuData?.listMenu?.menu;
        if (menuData?.listMenu?.menu) {
            setMnData(() => menuData?.listMenu?.menu);
            setDefaultValueMain({
                title: menuData?.listMenu?.menu?.title || '',
                imageAltText: menuData?.listMenu?.menu?.imageAltText || '',
                status: menuData?.listMenu?.menu?.status || '',
                menuPosition: menuData?.listMenu?.menu?.menuPosition || ''
            });
            if (menuDetails.logo.url) {
                setImageUrl(menuDetails.logo.url);
                setImageLoading(false);
            }
            setImageLoading(false);

            setImage({ name: menuDetails.logo.name, contentType: menuDetails.logo.contentType, objectKey: menuDetails.logo.objectKey });
            let sortedArray = [...menuDetails.menuItems];
            sortedArray = sortedArray
                .map((e) => {
                    const children = [...e.children];
                    return {
                        id: e.id,
                        name: e.name,
                        linkType: e.linkType,
                        link: e.link,
                        iconType: e.iconType,
                        icon: e.icon,
                        index: e.index,
                        children: children.sort((a, b) => a.index - b.index)
                    };
                })
                .sort((a, b) => a.index - b.index);
            setMenuItemArray(sortedArray);
        }
    }, [menuData]);

    const updateMenuArrayList = (newUpdatedMenuItemArray) => {
        let sortedArray = [...newUpdatedMenuItemArray];
        sortedArray = sortedArray
            .map((e) => {
                const children = [...e.children];
                return {
                    id: e.id,
                    name: e.name,
                    linkType: e.linkType,
                    link: e.link,
                    iconType: e.iconType,
                    icon: e.icon,
                    index: e.index,
                    children: children.sort((a, b) => a.index - b.index)
                };
            })
            .sort((a, b) => a.index - b.index);
        setMenuItemArray(sortedArray);
    };

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        setSaveLoading(true);
        if (croppedImage) {
            try {
                const blob = base64ToBlob(croppedImage, imageType);
                const imageExt = imageType.split('/').pop();
                const filename = `${uuid()}.${imageExt}`;
                const imgDetail = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                values.logo = imgDetail?.fileDetails;
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        const dataToSubmit = {
            title: values.title,
            logo: values.logo,
            imageAltText: values.imageAltText,
            status: values.status,
            menuPosition: values.menuPosition,
            menuItems: await Promise.all(
                menuItemArray.map(async (menuItem, index) => {
                    return {
                        id: menuItem.id,
                        name: menuItem.name,
                        linkType: menuItem.linkType,
                        link: menuItem.link,
                        iconType: menuItem.iconType,
                        icon:
                            menuItem.iconType == 'none'
                                ? undefined
                                : typeof menuItem.icon == 'string'
                                  ? menuItem.icon
                                  : await uploadFile(menuItem.icon),
                        children: await Promise.all(
                            menuItem.children.map(async (childMenuItem, j) => {
                                return {
                                    id: childMenuItem.id,
                                    name: childMenuItem.name,
                                    linkType: childMenuItem.linkType,
                                    link: childMenuItem.link,
                                    iconType: childMenuItem.iconType,
                                    icon:
                                        childMenuItem.iconType == 'none'
                                            ? undefined
                                            : typeof childMenuItem.icon == 'string'
                                              ? childMenuItem.icon
                                              : await uploadFile(childMenuItem.icon),
                                    index: j
                                };
                            })
                        ),
                        index: index
                    };
                })
            )
        };

        handleUpdateMenu({ variables: { id: params.id, input: dataToSubmit } })
            .then((success: any) => {
                handleOpenSnackbar({ message: success.data.updateMenu.message, alertType: 'success' });
                setSaveLoading(false);
                navigate('/menu/list');
            })
            .catch((err: any) => {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
                sessionStorage.clear();
                setSaveLoading(false);
            });
        setSubmitting(false);
    };

    const saveMenuItem = async (values, { setSubmitting }) => {
        if (!form.errors) {
            if (!isEdit) {
                if (modalOpenClickedFrom.clickedFrom == 'parent') {
                    setMenuItemArray((current) => [...current, { ...values, id: uuid() }]);
                    setImageMenuUrl(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
                } else if (modalOpenClickedFrom.clickedFrom == 'child') {
                    let tempArray = [...menuItemArray];
                    tempArray = tempArray.map((p, index) => {
                        return p.id == modalOpenClickedFrom.id
                            ? {
                                  id: p.id,
                                  name: p.name,
                                  linkType: p.linkType,
                                  link: p.link,
                                  iconType: p.iconType,
                                  icon: p.icon,
                                  index: index,
                                  children: p.children.concat({
                                      id: uuid(),
                                      name: values.name,
                                      linkType: values.linkType,
                                      link: values.link,
                                      iconType: values.iconType,
                                      icon: values.icon,
                                      index: values.index
                                  })
                              }
                            : p;
                    });
                    setMenuItemArray(tempArray);
                    setImageMenuUrl(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
                }
            } else if (isEdit) {
                if (modalOpenClickedFrom.clickedFrom == 'parent') {
                    let tempArray = [...menuItemArray];
                    tempArray = tempArray.map((p, index) => {
                        return p.id === isEdit
                            ? {
                                  id: p.id,
                                  name: values.name,
                                  linkType: values.linkType,
                                  link: values.link,
                                  iconType: values.iconType,
                                  icon: values.icon,
                                  children: p.children,
                                  index: index
                              }
                            : p;
                    });
                    setMenuItemArray(tempArray);
                    setImageMenuUrl(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
                } else if (modalOpenClickedFrom.clickedFrom == 'child') {
                    let tempArray = [...menuItemArray];
                    tempArray = tempArray.map((p) => {
                        const editedChildrenArray = p.children.map((e, index) => {
                            return e.id == modalOpenClickedFrom.id
                                ? {
                                      id: e.id,
                                      name: values.name,
                                      linkType: values.linkType,
                                      link: values.link,
                                      iconType: values.iconType,
                                      icon: values.icon,
                                      index: index
                                  }
                                : e;
                        });
                        return {
                            id: p.id,
                            name: p.name,
                            linkType: p.linkType,
                            link: p.link,
                            iconType: p.iconType,
                            icon: p.icon,
                            index: p.index,
                            children: editedChildrenArray
                        };
                    });
                    setMenuItemArray(tempArray);
                    setImageMenuUrl(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
                }
            }
        }
        handleImageReset();
        handleClose();
        setSubmitting(false);
    };

    const getImageUrl = async (x: any) => {
        const imageUpload = await handleImageUpload({
            variables: {
                input: {
                    path: `temp/${x}`,
                    contentType: 'images/*',
                    method: SignedUrlMethod.GET
                }
            }
        });

        setImageMenuUrl(imageUpload?.data?.getPreSignedUrl.url);
        setImageMenuLoading(false);
    };

    const handleEditItemMenu = async (menuItemId) => {
        const menuItem = menuItemArray.find((item) => item.id == menuItemId);
        setDefaultItem({
            id: menuItem.id,
            name: menuItem.name,
            linkType: menuItem.linkType,
            link: menuItem.link,
            iconType: menuItem.iconType,
            icon: menuItem.icon,
            children: []
        });

        if (menuItem.icon) {
            setImageMenuLoading(true);
            getImageUrl(menuItem.icon);
        }
        setIconValue(menuItem.icon);
        setLinkType(menuItem.linkType);
        handleOpen({ clickedFrom: 'parent', ...menuItem });
        setIsEdit(menuItemId);
    };

    const handleEditItemMenuChild = async (childId, parentId) => {
        const parendMenuItem = menuItemArray.find((item) => item.id == parentId);
        const childMenuItem = parendMenuItem.children.find((item) => item.id == childId);
        setDefaultItem({
            id: childMenuItem.id,
            name: childMenuItem.name,
            linkType: childMenuItem.linkType,
            link: childMenuItem.link,
            iconType: childMenuItem.iconType,
            icon: childMenuItem.icon,
            children: []
        });

        if (childMenuItem.icon) {
            setImageMenuLoading(true);
            getImageUrl(childMenuItem.icon);
        }
        setIconValue(childMenuItem.icon);
        handleOpen({ clickedFrom: 'child', ...childMenuItem });
        setIsEdit(parentId);
        setIsEditChild(childId);
        setLinkType(childMenuItem.linkType);
    };

    const [submenuItemId, setSubmenuItemId] = useState('');

    const handleDeleteItemMenu = async () => {
        const index = menuItemArray.map((e) => e.id).indexOf(submenuItemId);
        if (index > -1) {
            const tempArray = [...menuItemArray];
            tempArray.splice(index, 1);
            setMenuItemArray(tempArray);
            dispatch(closeModal());
        }
    };

    const [childMenuId, setChildMenuId] = useState('');
    const [parentMenuId, setParentMenuId] = useState('');

    const handleOpenModal = (childId: string, parentId?: string | any) => {
        setChildMenuId(childId);
        setParentMenuId(parentId);
        setSubmenuItemId(childId);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleDeleteItemMenuChild = async () => {
        const indexOfParent = menuItemArray.map((e) => e.id).indexOf(parentMenuId);
        if (indexOfParent > -1) {
            const tempArray = [...menuItemArray];
            const indexOfChild = tempArray[indexOfParent].children.map((e) => e.id).indexOf(childMenuId);
            tempArray[indexOfParent].children.splice(indexOfChild, 1);
            setMenuItemArray(tempArray);
            dispatch(closeModal());
        }
    };

    const handleUploadLogo = async (event) => {
        const file = event.target.files[0];
        if (file?.type == 'image/png' || file?.type == 'image/jpg' || file?.type == 'image/jpeg') {
            if (file.size > 1048576) {
                handleOpenSnackbar({ message: 'Image size must not exceed 1mb', alertType: 'error' });
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setOpenCropper(true);
                    setImageType(file.type);
                    setBase64Image(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            handleOpenSnackbar({ message: 'Only jpg, jpeg or png are allowed.', alertType: 'error' });
        }
    };

    useEffect(()=>{
        if(currentSubMenuFileName && subMenuCroppedImage[`${currentSubMenuFileName}`])
          {  try {
                const blob = base64ToBlob(subMenuCroppedImage[`${currentSubMenuFileName}`], subMenuImageType);
                
                blobUploadHelper(blob, handleImageUpload, currentSubMenuFileName, imageType).then((result) =>
                    console.log('result====>', result)
                );

                let updatedObject={...subMenuBlobImage};
                updatedObject[`${currentSubMenuFileName}`]=blob;
                setSubMenuBlobImage(updatedObject);
                
            } catch (error) {
                console.error('Error uploading file:', error);
            }}
         
        
    },[subMenuCroppedImage])

    const handleUploadMenuImage = async (event) => {

        const file = event.target.files[0];
        if (file?.type == 'image/png' || file?.type == 'image/jpg' || file?.type == 'image/jpeg') {
            if (file.size > 1048576) {
                handleOpenSnackbar({ message: 'Image size must not exceed 1mb', alertType: 'error' });
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSubMenuOpenCropper(true);
                    setSubMenuImageType(file.type);
                    setSubMenuBase64Image(reader.result);
                };
                reader.readAsDataURL(file);

                const filename = `${uuid()}.${event.target.files[0].name.split('.').pop()}`;
                setCurrentSubMenuFileName(filename);

                return filename;
            }
        } else {
            handleOpenSnackbar({ message: 'Only jpg, jpeg or png are allowed.', alertType: 'error' });
        }
    };


    const Image = ({ imagePlaceholder, imageSet, handleReset }) => (
        <ImageWrapper>
            <IconButtonWrapper imageSet={imageSet} onClick={handleReset}>
                <CloseIcon style={{ color: 'black' }} />
            </IconButtonWrapper>
            <img src={imagePlaceholder} style={{ height: '100%' }} />
        </ImageWrapper>
    );

    if (saveLoading || menuLoading) {
        return <CustomLoader  />;
    }

    return (
        <>
            <Formik
                enableReinitialize
                validationSchema={validationSchema}
                initialValues={defaultValueMain}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <MainCard title="Edit Menu">
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <TextField
                                        fullWidth
                                        id="title"
                                        placeholder="Enter title"
                                        value={values.title}
                                        name="title"
                                        label="Title"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: false }}
                                    />
                                    {touched.title && errors.title && (
                                        <FormHelperText error id="title-error">
                                            {errors.title}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <FormLabel>Logo:</FormLabel>
                                    <ImageWrapper>
                                        {imageLoading ? <CircularProgress /> : <img src={croppedImage || imageUrl} style={{ height: '100%' }} />}
                                    </ImageWrapper>
                                    <input id="menu-logo" type="file" name="logo" onBlur={handleBlur} onChange={handleUploadLogo} hidden />
                                    <Button variant="outlined" component={FormLabel} htmlFor="menu-logo">
                                        Change
                                    </Button>
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <TextField
                                        fullWidth
                                        id="imageAltText"
                                        placeholder="Enter Image Alternate Text"
                                        value={values.imageAltText}
                                        name="imageAltText"
                                        label="ImageAltText"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: false }}
                                    />
                                    {touched.imageAltText && errors.imageAltText && (
                                        <FormHelperText error id="imageAltText-error">
                                            {errors.imageAltText}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="menu-status-label">Menu Status</InputLabel>
                                        <Select
                                            labelId="menu-status-label"
                                            id="menu-status"
                                            value={values.status}
                                            name="status"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">InActive</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {touched.status && errors.status && (
                                        <FormHelperText error id="status-error">
                                            {errors.status}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="menu-position-label">Menu Position</InputLabel>
                                        <Select
                                            labelId="menu-position-label"
                                            id="menu-position"
                                            value={values.menuPosition}
                                            name="menuPosition"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="header">Header</MenuItem>
                                            <MenuItem value="footer">Footer</MenuItem>
                                        </Select>
                                    </FormControl>

                                    {touched.menuPosition && errors.menuPosition && (
                                        <FormHelperText error id="menuPosition-error">
                                            {errors.menuPosition}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} className="menu-item-drag">
                                    <Typography variant="h4" mb={3}>
                                        Menu Items
                                    </Typography>
                                    <DragDrop updateMenuArray={updateMenuArrayList} menuItemArray={menuItemArray} type="main" route="menu">
                                        {menuItemArray.map((item, index) => {
                                            return (
                                                <React.Fragment key={item.id}>
                                                    <Stack className="menu-item" key={item.id}>
                                                        <Typography variant="h4" className="heading-main">
                                                            {item.name}
                                                        </Typography>
                                                        <Stack>
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleEditItemMenu(item.id)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>

                                                            <IconButton
                                                                color="secondary"
                                                                size="small"
                                                                onClick={() => handleOpenModal(item.id)}
                                                            >
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </Stack>
                                                    </Stack>

                                                    <DragDrop
                                                        updateMenuArray={updateMenuArrayList}
                                                        menuItemArray={menuItemArray}
                                                        parentMenuId={item.id}
                                                        type="child"
                                                        route="menu"
                                                    >
                                                        {item.children.map((child, i) => {
                                                            return (
                                                                <React.Fragment key={child.id}>
                                                                    <Stack className="menu-item" key={child.id}>
                                                                        <Typography variant="h4" className="heading-main">
                                                                            {child.name}
                                                                        </Typography>
                                                                        <Stack>
                                                                            <IconButton
                                                                                color="primary"
                                                                                size="small"
                                                                                onClick={() => handleEditItemMenuChild(child.id, item.id)}
                                                                            >
                                                                                <EditIcon />
                                                                            </IconButton>
                                                                            <IconButton
                                                                                color="secondary"
                                                                                size="small"
                                                                                onClick={() => handleOpenModal(child.id, item.id)}
                                                                            >
                                                                                <DeleteIcon color="error" />
                                                                            </IconButton>
                                                                        </Stack>
                                                                    </Stack>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </DragDrop>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleOpen({ clickedFrom: 'child', ...item })}
                                                    >
                                                        + Add Menu Item to {item.name}
                                                    </Button>
                                                </React.Fragment>
                                            );
                                        })}
                                    </DragDrop>

                                    <Button variant="outlined" onClick={() => handleOpen({ clickedFrom: 'parent' })}>
                                        + Add Item
                                    </Button>
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12}>
                                    <Button variant="contained" type="submit">
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </form>
                )}
            </Formik>
            <Divider />
            <Modal open={open} onClose={handleClose} className="menu-modal">
                <Paper>
                    <Formik initialValues={defaultItem} validationSchema={validationSchemaMenuItem} onSubmit={saveMenuItem}>
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            setFieldValue,
                            handleSubmit: handleSubmitMenuItem,
                            isSubmitting,
                            touched,
                            values
                        }) => (
                            <form noValidate onSubmit={handleSubmitMenuItem}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder="Link Type"
                                            name="name"
                                            label="Name"
                                            value={values.name}
                                            type="text"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            inputProps={{ minLength: 3, maxLength: 30 }}
                                            InputLabelProps={{ shrink: false }}
                                        />
                                        {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                                    </Grid>
                                    <GridDivider />
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="linkType"
                                            label="Link Type"
                                            value={values.linkType}
                                            select
                                            onChange={(event) => {
                                                handleChange(event);
                                                setLinkType(event.target.value);
                                            }}
                                            InputLabelProps={{ shrink: false }}
                                        >
                                            {linkTypeSelectOptions.map(({ label, value }) => (
                                                <MenuItem key={value} value={value}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.linkType && errors.linkType && <FormHelperText error>{errors.linkType}</FormHelperText>}
                                    </Grid>
                                    <GridDivider />
                                    {values.linkType == 'customPage' && (
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Link"
                                                    name="link"
                                                    label="Link"
                                                    value={values.link}
                                                    type="text"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    InputLabelProps={{ shrink: false }}
                                                />
                                                {touched.link && errors.link && <FormHelperText error>{errors.link}</FormHelperText>}
                                            </Grid>
                                            <GridDivider />
                                        </>
                                    )}

                                    {['page', 'taxonomy'].includes(values.linkType) && (
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    name="link"
                                                    label="Link"
                                                    value={values.link}
                                                    select
                                                    onChange={handleChange}
                                                    InputLabelProps={{ shrink: false }}
                                                >
                                                    {linkSelectOptions.map(({ label, value }) => (
                                                        <MenuItem key={value} value={value}>
                                                            {label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                {touched.link && errors.link && <FormHelperText error>{errors.link}</FormHelperText>}
                                            </Grid>
                                            <GridDivider />
                                        </>
                                    )}

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="iconType"
                                            label="Icon Type"
                                            value={values.iconType}
                                            select
                                            onChange={(event) => {
                                                values.icon = '';
                                                handleChange(event);
                                                setImgConfig(defaultImageConfig);
                                            }}
                                            InputLabelProps={{ shrink: false }}
                                        >
                                            {iconTypeSelectOptions.map(({ label, value }) => (
                                                <MenuItem key={value} value={value}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        {touched.iconType && errors.iconType && <FormHelperText error>{errors.iconType}</FormHelperText>}
                                    </Grid>
                                    <GridDivider />
                                    {values.iconType == 'icon' && (
                                        <>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    name="icon"
                                                    type="text"
                                                    value={values.icon}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    label="Icon"
                                                    inputProps={{}}
                                                    InputLabelProps={{ shrink: false }}
                                                />
                                                {touched.icon && errors.icon && <FormHelperText error>{errors.icon as any}</FormHelperText>}
                                            </Grid>
                                            <GridDivider />
                                        </>
                                    )}

                                    {values.iconType == 'image' && (
                                        <>
                                            <Grid item xs={12}>
                                                <FormControl
                                                    fullWidth
                                                    error={Boolean(touched.icon && errors.icon)}
                                                    sx={{ ...theme.typography.customInput }}
                                                >
                                                    <Grid item xs={8}>
                                                        <ImageWrapper>
                                                            {imageMenuLoading && imageMenuUrl ? (
                                                                <CircularProgress />
                                                            ) : (
                                                                <img src={subMenuCroppedImage[`${values.icon}`]||"" || imageMenuUrl} style={{ height: '100%' }} />
                                                            )}
                                                        </ImageWrapper>
                                                        <input
                                                            id="submenu-logo" 
                                                            type="file"
                                                            name="icon"
                                                            onBlur={handleBlur}
                                                            onChange={async (event) => {
                                                                if (event) {
                                                                    const filename = await handleUploadMenuImage(event);
                                                                    setFieldValue('icon', filename);
                                                                }
                                                            }}
                                                            hidden
                                                        />
                                                        <Button variant="outlined" component={FormLabel} htmlFor="submenu-logo">
                                                            Change
                                                        </Button>
                                                    </Grid>
                                                    {touched.icon && errors.icon && (
                                                        <FormHelperText error>{errors.icon as any}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <GridDivider />
                                        </>
                                    )}
                                    <Grid item xs={12}>
                                        <Button size="large" type="submit" variant="outlined" color="primary">
                                            {isEdit == '' ? 'Save' : 'Update'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Paper>
            </Modal>
            {openCropper && (
                <ImageCropperModal
                    open={openCropper}
                    setOpen={setOpenCropper}
                    base64Image={base64Image}
                    setCroppedImage={setCroppedImage}
                    title="Crop logo"
                />
            )}

            {subMenuOpenCropper && (
                <ImageCropperModal
                    open={subMenuOpenCropper}
                    setOpen={setSubMenuOpenCropper}
                    base64Image={subMenuBase64Image}
                    setCroppedImage={(value)=>{
                        let updatedObject={...subMenuCroppedImage};
                        updatedObject[`${currentSubMenuFileName}`]=value;
                         setSubMenuCroppedImage(updatedObject)
 
                     }}
                    title="Crop submenu logo"
                />
            )}
            <ConfirmModal
                title="Delete Menu Item"
                content="Are you sure you want to delete menu item ?"
                yes={!parentMenuId ? handleDeleteItemMenu : handleDeleteItemMenuChild}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </>
    );
};
export default EditMenu;
