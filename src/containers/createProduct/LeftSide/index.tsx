import React, { useEffect, useState } from 'react'

//styles
import SelectComponent from '@/components/Select'
import Button from '@/designs/Button'
import DatePicker from '@/designs/DatePicker'
import InputNumber from '@/designs/InputNumber'
import InputText from '@/designs/InputText'
import UploadImage from '@/designs/UploadImage'
import MultipleUploadImage from '@/designs/MultipleUploadImage'
import { IconButton, MenuItem, Tooltip } from '@mui/material'

//hooks
import { useAppSelector } from '@/hooks/useRedux'
import { useRouter } from 'next/router'

//utils
import axios from 'axios'
import * as yup from 'yup'
import { IRootState } from '@/redux'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import { Config } from '@/config/api'
import { configResponse } from '@/utils/request'
import SelectCustomFieldComponent from '@/components/SelectCustomField'
import RadioButton from '@/designs/RadioButton'
import { PencilIcon, TagIcon } from '@heroicons/react/24/outline'
import SelectCategoryDialog from '@/components/SelectCategoryDialog'

interface ILeftSideProps {}

interface IFormValue {
  productName: string
  brand?: string
  size?: string
  color?: string
  condition?: string
  category?: string
  priceStart: string
  stepBid: string
  bidClosingDate?: string
}

interface IOption {
  id: string
  name: string
}

interface IColor {
  id: string
  name: string
  bg: string
}

export interface IAddressResponse {
  addressId: number
  homeNumber: string
  cityName: string
  district: IOption
  ward: IOption
}

const validationSchema = yup.object().shape<{ [k in keyof IFormValue]: any }>({
  productName: yup.string().required('Vui lòng nhập tên sản phẩm'),
  priceStart: yup.string().required('Vui lòng giá khởi điển'),
  stepBid: yup.string().required('Vui lòng nhập bước giá'),
})

const LeftSide: React.FC<ILeftSideProps> = props => {
  const { user } = useAppSelector((state: IRootState) => state.auth)
  const { currentCategory } = useAppSelector(
    (state: IRootState) => state.category,
  )
  const [initialValues, setInitialValues] = useState<IFormValue>({
    productName: '',
    brand: '',
    condition: '',
    category: '',
    priceStart: '',
    stepBid: '',
    bidClosingDate: '',
    size: '',
    color: '',
  })

  const [customFields, setCustomFields] = useState<
    {
      name: string
      type: string
      options?: string[]
      value?: string
    }[]
  >((currentCategory as IProductCategory)?.properties)
  const [openSelectCategory, setOpenSelectCategory] = useState<boolean>(false)

  //functions
  const handleSubmit = async (values: IFormValue) => {}

  useEffect(() => {
    setCustomFields((currentCategory as IProductCategory)?.properties)
  }, [currentCategory])

  return (
    <>
      <div className="bg-white border-gray-200 border rounded-xl h-full p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-gray-600 font-bold text-2xl mb-2">
            Thêm sản phẩm đấu giá
          </h1>
          <Tooltip title="Thay đổi danh mục">
            <IconButton onClick={() => setOpenSelectCategory(true)}>
              <TagIcon className="w-6 h-6 text-gray-500 font-semibold" />
            </IconButton>
          </Tooltip>
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, submitForm, errors }) => {
            return (
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 mt-5">
                <InputText
                  name={`name`}
                  label={`Tên sản phẩm`}
                  placeholder={`Nhập tên của sản phẩm`}
                />
                <InputNumber
                  name={`startPrice`}
                  label={`Giá khởi điểm`}
                  placeholder={`Nhập giá khởi điểm của sản phẩm`}
                />
                <InputNumber
                  name={`bidIncrement`}
                  label={`Bước giá`}
                  placeholder={`Nhập bước giá của sản phẩm`}
                />

                {(currentCategory as IProductCategory)?.properties?.map(
                  (property, propertyIndex) =>
                    !!property?.options?.length ? (
                      <>
                        <SelectCustomFieldComponent
                          placeholder={`Chọn trường ${property?.name}`}
                          name={property.name}
                          label={`${property?.name}`}
                          options={property?.options}
                          optionSelected={
                            customFields?.[propertyIndex]?.value || ''
                          }
                          onSelect={option => {
                            let cloneFieldValue = [...customFields]
                            cloneFieldValue[propertyIndex] = {
                              ...customFields[propertyIndex],
                              value: option,
                            }
                            setCustomFields([...cloneFieldValue])
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {property.type == 'text' ? (
                          <InputText
                            name={`${property?.name}`}
                            value={'100'}
                            label={`${property?.name}`}
                            placeholder={`Nhập ${property?.name} của sản phẩm`}
                          />
                        ) : (
                          <>
                            {property.type == 'number' ? (
                              <InputNumber
                                name={`${property?.name}`}
                                value={'100'}
                                label={`${property?.name}`}
                                placeholder={`Nhập ${property?.name} của sản phẩm`}
                              />
                            ) : (
                              <SelectComponent
                                name={`${property?.name}`}
                                onSelect={option => {}}
                                label={`${property.name}`}
                                placeholder={`Chọn ${property?.name}`}
                                optionSelected={{ id: true, name: 'Đúng' }}
                                options={[
                                  { id: true, name: 'Đúng' },
                                  { id: false, name: 'Sai' },
                                ]}
                              />
                            )}
                          </>
                        )}
                      </>
                    ),
                )}

                {/* <UploadImage
                onSelect={listImage => {
                  // setThumbnailSelected(listImage)
                }}
              />
              <MultipleUploadImage
                onSelect={listImage => {
                  // setImagesSelected(listImage)
                }}
              /> */}
                {/* <InputText
                name="productName"
                value={initialValues.productName}
                label="Tên sản phẩm"
                placeholder="Nhập tên sản phẩm"
              />
              <SelectComponent
                keyLabel="name"
                keyValue="id"
                name="brand"
                optionSelected={brandSelected}
                options={brands}
                label="Chọn thương hiệu"
                placeholder=""
                onSelect={brand => setBrandSelected(brand)}
                error={brandError}
              />
              <SelectComponent
                keyLabel="name"
                keyValue="id"
                name="condition"
                optionSelected={conditionSelected}
                options={conditions}
                label="Chọn tình trạng hiệu"
                placeholder=""
                onSelect={condition => setConditionSelected(condition)}
                error={conditionError}
              />
              <SelectComponent
                keyLabel="name"
                keyValue="id"
                name="category"
                optionSelected={categorySelected}
                options={categories}
                label="Chọn danh mục"
                placeholder=""
                onSelect={category => setCategorySelected(category)}
                error={categoryError}
              />
              <SelectComponent
                keyLabel="name"
                keyValue="id"
                name="size"
                optionSelected={sizeSelected}
                options={sizes}
                label="Chọn size"
                placeholder=""
                onSelect={size => setSizeSelected(size)}
                error={sizeError}
              />
              <SelectComponent
                keyLabel="name"
                keyValue="id"
                name="color"
                optionSelected={colorSelected}
                options={colors}
                label="Chọn màu"
                error={colorError}
                placeholder=""
                onSelect={size => setSizeSelected(size)}
                renderOption={options => {
                  return options?.map((option: any) => (
                    <MenuItem
                      value={option.id}
                      onClick={() => setColorSelected(option)}
                    >
                      <div className="w-full p-2 flex justify-between items-center ">
                        <p className="text-sm text-gray-600">
                          {option.id.toUpperCase()}
                        </p>
                        <div
                          className={`${option.bg} w-6 h-6 rounded-full border-gray-200 border`}
                        ></div>
                      </div>
                    </MenuItem>
                  ))
                }}
              />
              <InputNumber
                name="priceStart"
                value={initialValues?.priceStart}
                label="Giá khởi điểm"
                placeholder="Nhập mức giá khởi điểm của sản phẩm"
              />
              <InputNumber
                name="stepBid"
                value={initialValues?.stepBid}
                label="Bước giá"
                placeholder="Nhập bước giá của sản phẩm"
              />
              <DatePicker
                label="Chọn ngày kết thúc đấu giá"
                name="bidClosingDate"
              />
              <div className="col-span-2 mt-2">
                <UploadImage
                  onSelect={listImage => setThumbnailSelected(listImage)}
                />
                <MultipleUploadImage
                  onSelect={listImage => setImagesSelected(listImage)}
                />
              </div> */}

                <div className="col-span-2 mt-2">
                  <Button
                    variant="primary"
                    isLoading={false}
                    type="submit"
                    title="Đăng sản phẩm"
                    onClick={() => handleSubmit(initialValues as any)}
                  />
                </div>
              </div>
            )
          }}
        </Formik>
      </div>

      {openSelectCategory ? (
        <SelectCategoryDialog
          open={openSelectCategory}
          onClose={() => setOpenSelectCategory(false)}
        />
      ) : null}
    </>
  )
}

export default LeftSide
