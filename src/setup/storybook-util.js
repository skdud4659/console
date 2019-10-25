// eslint-disable-next-line import/no-extraneous-dependencies
import {
    text, boolean, number, object, array, select,
} from '@storybook/addon-knobs/vue';

const propsTypeMapping = {
    string: text,
    boolean,
    number,
    object,
    array,
    select,
};

function makeKnobProp(prop, value) {
    const typeName = prop.type.name;
    const knobsType = propsTypeMapping[typeName];
    if (knobsType) {
        // let defaultValue = prop.defaultValue.func
        // ? eval(prop.defaultValue.value)() : eval(prop.defaultValue.value) ;
        return { default: knobsType(prop.name, value) };
    }
    return undefined;
}

/**
 * prop info
 * @typedef {Object} propInfo
 * @property {string} name - prop name
 * @property {any} default - prop default value optional
 */

/**
 * custom props
 * @typedef {propInfo} props
 */
/**
 * auto make storybook knob props
 *
 * @param {Object} comp - target vue component
 * @param {props} props
 * @return {Object} knob props
 *
 * @example get all props and use component default value
 *     import BaseInput from './BaseInput';
 *     export const simple = () => ({
 *          ...
 *          props: {
 *              ...autoProps(BaseInput)
 *      });,*
 *
 * @example choice prop but use component default value
 *     import BaseInput from './BaseInput';
 *     export const simple = () => ({
 *          ...
 *          props: {
 *              ...autoProps(BaseInput,[{name:'value'}])
 *      });,
 *
 * @example choice prop and change default value
 *     import BaseInput from './BaseInput';
 *     export const simple = () => ({
 *          ...
 *          props: {
 *              ...autoProps(BaseInput,[{name:'value',default:'typing here!!'}])
 *      });,
 */

const autoProps = function (comp, props = []) {
    const mapping = {};
    // eslint-disable-next-line no-underscore-dangle
    const docProps = comp.__docgenInfo.props;
    const propsValue = comp.props;

    Object.keys(docProps).forEach((key) => {
        let defaultValue = propsValue[key].default;
        if (props.length) {
            const info = (props.find(o => o.name === key));
            if (!info) {
                return;
            } if ('default' in info) {
                defaultValue = info.default;
            }
        }
        const knob = makeKnobProp(docProps[key], defaultValue);
        if (knob) {
            mapping[key] = knob;
        }
    });
    return mapping;
};

// eslint-disable-next-line import/prefer-default-export
export { autoProps };
