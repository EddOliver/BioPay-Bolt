import { CameraView } from 'expo-camera';
import { ImageManipulator } from 'expo-image-manipulator';
import React, { Component, createRef } from 'react';

export default class CamFace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      take: false,
    };
    this.data = createRef(null);
    this.camera;
  }

  async takePicture() {
    try {
      const options = {
        quality: 1,
        base64: true,
      };
      const {
        base64: preImage,
        width,
        height,
      } = await this.camera.takePictureAsync(options);
      let image = `${preImage.replace(/^data:image\/[a-z]+;base64,/, '')}`;
      this.props.onImage(image);
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.take !== this.props.take && this.props.take) {
      this.takePicture();
    }
  }

  render() {
    return (
      <React.Fragment>
        <CameraView
          ratio={'1:1'}
          facing={this.props.facing}
          ref={(ref) => (this.camera = ref)}
          style={{ height: '300', width: '300' }}
        />
      </React.Fragment>
    );
  }
}
