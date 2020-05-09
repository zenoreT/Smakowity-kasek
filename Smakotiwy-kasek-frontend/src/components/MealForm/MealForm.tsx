import "./MealForm.css";

import { Button, Form, Icon, Input, Radio, Select, Spin, Upload, Modal, notification, InputNumber, PageHeader } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { RadioChangeEvent } from "antd/lib/radio";
import { UploadChangeParam } from "antd/lib/upload";
import { debounce } from "lodash";
import { FormEvent, useEffect } from "react";
import React, { useState } from "react";

import {
  ACCESS_TOKEN,
  API_BASE_URL,
  ITEM_NAME_MIN_LENGTH,
  ITEM_NAME_MAX_LENGTH,
  ITEM_DESCRIPTION_MIN_LENGTH,
  ITEM_DESCRIPTION_MAX_LENGTH,
  IMAGE_SUCCESS,
  IMAGE_ERROR,
  MSG_NAME_1,
  MSG_NAME_2,
  MSG_NAME_3,
  MSG_NAME_4,
  MSG_DESCRIPTION_1,
  MSG_DESCRIPTION_2,
  MSG_DESCRIPTION_3,
  MSG_DESCRIPTION_4,
  MSG_IMAGE_1,
  MSG_IMAGE_2,
  MSG_PRICE_1,
  /*MSG_QUANTITY_1,*/
  MSG_CATEGORY_1,
  MSG_INGREDIENTS_1,
  MSG_MEALS_1,
} from "../../utils/Consts";
import { Category } from "../../utils/models/Category";
import { getItems, deleteItemsImage } from "../../utils/ServerApi";
import { createDataObjects, getEnumKeyFromValue, getEnumValueFromKey } from "../../utils/Utils";
import { UploadFile } from "antd/lib/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import { ItemType } from "../../utils/models/ItemType";
import { LabeledValue, SelectValue } from "antd/lib/select";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { TableRequest } from "../../utils/models/TableRequest";

interface Props extends FormComponentProps {
  itemType: ItemType;
  item: any;
  loading: boolean;
  handleSubmit(values: any, itemType: string): void;
  fetchData: (tableRequest: TableRequest) => void;
}

interface State {
  itemType: ItemType;
  category?: Category;
  fetching?: boolean;
  foundItems: any[];
  previewVisible?: boolean;
  previewImage?: string;
  selectedItems: any[];
  // adtitionalSelectedItems: any[];
}

const MealForm = (props: Props) => {
  let lastFetchId = 0;
  const item = props.item;

  const [state, setState] = useState<State>({
    itemType: props.itemType,
    fetching: false,
    foundItems: [],
    previewVisible: false,
    previewImage: "",
    selectedItems: [],
    // adtitionalSelectedItems: [],
  });

  const handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      const image = values.imageName ? values.imageName[0] : undefined;
      if (!err && image && image.status === "done") {
        values.id = item.id;
        //set imageName as pictures uid
        values.imageName = image.uid + image.name.substr(image.name.length - 4);

        props.handleSubmit(createDataObjects(values), getEnumKeyFromValue(ItemType, state.itemType, true));

        props.form.resetFields();
        setState({
          itemType: state.itemType,
          category: state.category,
          fetching: false,
          foundItems: state.foundItems,
          selectedItems: [],
          // adtitionalSelectedItems: [],
        });
      }
    });
  };

  useEffectOnce(() => {
    props.fetchData({ results: 20, page: 1, sortField: "name" });
  });

  useEffect(() => {
    if (item) {
      const selectedItems = item.ingredients && item.meals ? item.ingredients.concat(item.meals) : [];
      setState({
        itemType: state.itemType,
        category: getEnumValueFromKey(Category, item.category) ? getEnumValueFromKey(Category, item.category) : Category.MEAL_SETS,
        fetching: false,
        foundItems: state.foundItems,
        selectedItems: selectedItems,
        // adtitionalSelectedItems: [],
      });
    }
  }, [item]);

  if (!item) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 141px)",
        }}
      />
    );
  }

  const fetchItems = (searchText: string, itemType: ItemType) => {
    const selectedItems: any[] = [];
    selectedItems.push(...state.selectedItems);
    if (item && item.ingredients && item.meals) {
      selectedItems.push(...item.ingredients);
      selectedItems.push(...item.meals);
    }

    setState({
      itemType: state.itemType,
      category: state.category,
      fetching: true,
      foundItems: [],
      selectedItems: selectedItems,
      // adtitionalSelectedItems: state.adtitionalSelectedItems,
    });

    if (!searchText) {
      setState({
        itemType: state.itemType,
        category: state.category,
        fetching: false,
        foundItems: [],
        selectedItems: selectedItems,
        // adtitionalSelectedItems: state.adtitionalSelectedItems,
      });
      return;
    }

    lastFetchId += 1;
    const fetchId = lastFetchId;

    // initialized with id = 0, so spring will return all awailable options since ids start at 1
    // ugly but faster then doing ifs in backend and using different methods based on whether the list is empty or not
    const ids = [0];
    ids.push(...selectedItems.map(item => item.id));

    const payload = {
      searchText: searchText,
      ids: ids,
    };

    const response = getItems(payload, itemType);
    response.then(data => {
      if (fetchId !== lastFetchId) {
        return;
      }
      setState({
        itemType: state.itemType,
        category: state.category,
        fetching: false,
        foundItems: data,
        selectedItems: selectedItems,
        // adtitionalSelectedItems: state.adtitionalSelectedItems,
      });
    });
  };

  const formTypeChange = (event: RadioChangeEvent) => {
    setState({
      itemType: event.target.value,
      foundItems: [],
      selectedItems: state.selectedItems,
      // adtitionalSelectedItems: state.adtitionalSelectedItems,
    });
    //reset fields
    const values = props.form.getFieldsValue();
    Object.keys(values).forEach(key => {
      values[key] = {
        value: values[key],
        errors: undefined,
      };
    });
    props.form.setFields(values);
  };

  const didMealTypeChange = (category: SelectValue): boolean => {
    const mealSet = getEnumKeyFromValue(Category, Category.MEAL_SETS);
    category = category as Category;
    return (category === mealSet && state.category !== Category.MEAL_SETS) || (category !== mealSet && state.category === Category.MEAL_SETS);
  };

  const changeCategory = (category: SelectValue) => {
    const foundItems = didMealTypeChange(category) ? [] : state.foundItems;
    const selectedItems = didMealTypeChange(category) ? [] : state.selectedItems;
    // const adtitionalSelectedItems = didMealTypeChange(category) ? [] : state.adtitionalSelectedItems;

    setState({
      itemType: state.itemType,
      category: Object.entries(Category)!.find(e => e[0] === category)![1],
      foundItems: foundItems,
      selectedItems: selectedItems,
      // adtitionalSelectedItems: adtitionalSelectedItems,
    });
  };

  const categoryOptions: JSX.Element[] = [];
  Object.entries(Category).forEach(e => {
    categoryOptions.push(<Select.Option key={e[0]}>{e[1]}</Select.Option>);
  });

  const uploadMessage = (info: UploadChangeParam) => {
    if (info.file.status === "done") {
      notification.success({ message: IMAGE_SUCCESS });
    } else if (info.file.status === "error") {
      notification.error({ message: IMAGE_ERROR });
    }
  };

  const handleCancel = () =>
    setState({
      itemType: state.itemType,
      category: state.category,
      previewVisible: false,
      foundItems: [],
      selectedItems: state.selectedItems,
      // adtitionalSelectedItems: state.adtitionalSelectedItems,
    });

  const handlePreview = (file: UploadFile) => {
    setState({
      itemType: state.itemType,
      category: state.category,
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      foundItems: [],
      selectedItems: state.selectedItems,
      // adtitionalSelectedItems: state.adtitionalSelectedItems,
    });
  };

  const handleRemove = (file: UploadFile) => {
    deleteItemsImage(file.uid + file.name.substr(file.name.length - 4));
  };

  const getUploadParams = (file: UploadFile) => {
    return {
      imageName: file.uid,
    };
  };

  const checkIfImage = () => {
    if (!props.form.getFieldValue("imageName")) {
      return false;
    }
    return !(props.form.getFieldValue("imageName") && props.form.getFieldValue("imageName").length === 0);
  };

  const isImageUnique = (rule: any, value: any, callback: any) => {
    if (checkIfImage() && value && value[0].status === "error") {
      callback(MSG_IMAGE_2);
    } else {
      callback();
    }
    callback();
  };

  const normalizeImageValue = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const filteredItems = state.foundItems.filter(
    item =>
      !state.selectedItems /*.concat(state.adtitionalSelectedItems)*/
        .find(x => {
          return x && x.id === item.id;
        })
  );

  const handleSelectedItems = (selectedItems: LabeledValue[]) => {
    const array: any[] = [];
    selectedItems.forEach(item => {
      const foundItem = state.foundItems.concat(state.selectedItems).find(x => x.id === item.key);
      if (foundItem) {
        array.push(foundItem);
      }
    });

    setState({
      itemType: state.itemType,
      category: state.category,
      foundItems: state.foundItems,
      selectedItems: array,
      // adtitionalSelectedItems: state.adtitionalSelectedItems,
    });
  };

  // const handleSelectedItemsAdditional = (selectedItems: LabeledValue[]) => {
  //   const array: any[] = [];
  //   selectedItems.forEach(item => {
  //     const foundItem = state.foundItems.find(x => x.id.toString() === item.key);
  //     if (foundItem) {
  //       array.push(foundItem);
  //     }
  //   });
  //   setState({
  //     formType: state.formType,
  //     category: state.category,
  //     foundItems: state.foundItems,
  //     selectedItems: state.selectedItems,
  //     adtitionalSelectedItems: array,
  //   });
  // };

  const { getFieldDecorator } = props.form;

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Tworzenie nowego posiłku" />
      <div className="meal-set-view">
        <Form onSubmit={handleSubmit} className="meal-set-form">
          <Radio.Group buttonStyle="solid" onChange={formTypeChange} defaultValue={state.itemType} className="form-type">
            <Radio.Button value={ItemType.Meal}>{ItemType.Meal}</Radio.Button>
            <Radio.Button value={ItemType.Ingredient}>{ItemType.Ingredient}</Radio.Button>
          </Radio.Group>
          <Form.Item hasFeedback>
            {getFieldDecorator("name", {
              initialValue: item.name,
              rules: [
                { required: true, message: MSG_NAME_1 },
                {
                  whitespace: true,
                  message: MSG_NAME_2,
                },
                {
                  min: ITEM_NAME_MIN_LENGTH,
                  message: MSG_NAME_3,
                },
                {
                  max: ITEM_NAME_MAX_LENGTH,
                  message: MSG_NAME_4,
                },
              ],
            })(<Input autoComplete="off" placeholder="Nazwa" />)}
          </Form.Item>
          {state.itemType === ItemType.Meal ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("description", {
                initialValue: item.description,
                rules: [
                  { required: true, message: MSG_DESCRIPTION_1 },
                  {
                    whitespace: true,
                    message: MSG_DESCRIPTION_2,
                  },
                  {
                    min: ITEM_DESCRIPTION_MIN_LENGTH,
                    message: MSG_DESCRIPTION_3,
                  },
                  {
                    max: ITEM_DESCRIPTION_MAX_LENGTH,
                    message: MSG_DESCRIPTION_4,
                  },
                ],
              })(<TextArea rows={4} autoComplete="off" placeholder="Opis" />)}
            </Form.Item>
          ) : null}
          <Form.Item hasFeedback>
            {getFieldDecorator("imageName", {
              initialValue: item.imageName && [
                {
                  uid: item.imageName.substring(0, item.imageName.length - 4),
                  name: item.imageName + ".png",
                  status: "done",
                  url: `${API_BASE_URL}/menu/images/get?imageName=${item.imageName}`,
                },
              ],
              valuePropName: "fileList",
              getValueFromEvent: normalizeImageValue,
              rules: [{ required: true, message: MSG_IMAGE_1 }, { validator: isImageUnique }],
            })(
              <Upload
                name="uploadFile"
                action={API_BASE_URL + "/menu/images/new"}
                headers={{
                  Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
                }}
                listType="picture-card"
                onChange={uploadMessage}
                onPreview={handlePreview}
                onRemove={handleRemove}
                data={getUploadParams}
                accept=".jpg,.jpeg,.png,.svg,.gif"
              >
                {!checkIfImage() ? (
                  <Button type="primary">
                    <Icon type="upload" /> Kliknij, aby wgrać obrazek
                  </Button>
                ) : null}
              </Upload>
            )}
            <Modal visible={state.previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: "100%" }} src={state.previewImage} />
            </Modal>
          </Form.Item>
          {state.itemType === ItemType.Meal ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("price", {
                initialValue: item.price,
                rules: [{ required: true, message: MSG_PRICE_1 }],
              })(<InputNumber autoComplete="off" placeholder="Cena produktu" type="number" min={0} precision={2} step={0.01} style={{ width: "100%" }} />)}
            </Form.Item>
          ) : null}
          {/* {state.itemType === ItemType.Ingredient ? (
        <Form.Item hasFeedback>
          {getFieldDecorator("quantity", {
            initialValue: item.quantity,
            rules: [{ required: true, message: MSG_QUANTITY_1 }],
          })(<InputNumber autoComplete="off" placeholder="Ilość produktu" type="number" min={0} precision={0} style={{ width: "100%" }} />)}
        </Form.Item>
      ) : null} */}
          {state.itemType === ItemType.Meal ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("category", {
                initialValue: item.category,
                rules: [{ required: true, message: MSG_CATEGORY_1 }],
              })(
                <Select placeholder="Wybierz kategorię produktu" onChange={changeCategory}>
                  {categoryOptions}
                </Select>
              )}
            </Form.Item>
          ) : null}
          {state.itemType === ItemType.Meal && state.category && state.category !== Category.MEAL_SETS ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("ingredients", {
                initialValue:
                  item.ingredients &&
                  item.ingredients.map((ingredient: any) => {
                    return { key: ingredient.id, label: ingredient.name };
                  }),
                rules: [{ required: true, message: MSG_INGREDIENTS_1 }],
              })(
                <Select
                  mode="multiple"
                  allowClear
                  labelInValue
                  placeholder="Wybierz składniki produktu"
                  notFoundContent={state.fetching ? <Spin size="small" className="spinner" /> : null}
                  filterOption={false}
                  onSearch={debounce(value => fetchItems(value, getEnumKeyFromValue(ItemType, ItemType.Ingredient, true)), 300)}
                  onChange={handleSelectedItems}
                >
                  {filteredItems.map(item => (
                    <Select.Option key={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : null}
          {/* {state.formType === ItemType.Meal && state.category && state.category !== Category.MEAL_SETS ? (
        <Form.Item hasFeedback>
          {getFieldDecorator("additionalIngredients")(
            <Select
              mode="multiple"
              labelInValue
              allowClear
              placeholder="Wybierz dodatkowe składniki produktu"
              notFoundContent={state.fetching ? <Spin size="small" className="spinner" /> : null}
              filterOption={false}
              onSearch={debounce(value => fetchItems(value, getEnumKeyFromValue(ItemType, ItemType.Ingredient)), 300)}
              onChange={handleSelectedItemsAdditional}
            >
              {filteredItems.map(item => (
                <Select.Option key={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      ) : null} */}
          {state.itemType === ItemType.Meal && state.category && state.category === Category.MEAL_SETS ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("meals", {
                initialValue:
                  item.meals &&
                  item.meals.map((meal: any) => {
                    return { key: meal.id, label: meal.name };
                  }),
                rules: [{ required: true, message: MSG_MEALS_1 }],
              })(
                <Select
                  mode="multiple"
                  allowClear
                  labelInValue
                  placeholder="Wybierz posiłki zestawu"
                  notFoundContent={state.fetching ? <Spin size="small" className="spinner" /> : null}
                  filterOption={false}
                  onSearch={debounce(value => fetchItems(value, getEnumKeyFromValue(ItemType, ItemType.Meal, true)), 300)}
                  onChange={handleSelectedItems}
                >
                  {filteredItems.map(item => (
                    <Select.Option key={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : null}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="meal-set-form-button" loading={props.loading}>
              Utwórz
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

MealForm.defaultProps = {
  itemType: ItemType.Meal,
};

export default Form.create<Props>()(MealForm);
