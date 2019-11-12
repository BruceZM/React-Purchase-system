import { Modal } from 'antd-mobile';
import React from 'react';
import PropTypes from 'prop-types';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
class ShowEditModal extends React.Component {
    // componentDidMount(){
    //     this.props.onRef(this)
    // }
    onWrapTouchStart = (e) => {
      // fix touch to scroll background page on iOS
      if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
        return;
      }
      const pNode = closest(e.target, '.am-modal-content');
      if (!pNode) {
        e.preventDefault();
      }
    }
    render() {
      const { visible,formContent,handleCancel,afterClose,popupVal,anType,transparent } = this.props;
      
      return (
        <Modal
          popup={popupVal}
          visible={visible}
          transparent={transparent}
          onClose={handleCancel}
          animationType={anType}
          afterClose={afterClose}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          {formContent}
        </Modal>
      );
    }
  }
ShowEditModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  transparent: PropTypes.bool,
  formContent: PropTypes.element,
  handleCancel: PropTypes.func.isRequired,
  afterClose: PropTypes.func
};

const { alert } = Modal;

function showConfirm(title,content,callback) {
    alert(title, content, [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: callback },
    ])
    
}

export {
    showConfirm,
    ShowEditModal
}