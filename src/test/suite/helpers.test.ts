import * as assert from 'assert';

import {convertFromJson, convertFromYaml} from "../../helpers";
import { loadFixture, stripNewLines, stripWhiteSpace } from '../testHelpers';
import { NamingConvention } from '../../converter';

suite('helpers', () => {
    suite('convertFromJson', () => {
        test('should convert json to camel case', async () => {
            const [input, expected] = await Promise.all([
                loadFixture('input.json'),
                loadFixture('expectedCamelJson.json')
            ]);

            const result = convertFromJson(input, NamingConvention.Camel);

            assert.deepStrictEqual(stripWhiteSpace(result), stripWhiteSpace(expected));
        });

        test('should convert json to snake case', async () => {
            const [input, expected] = await Promise.all([
                loadFixture('input.json'),
                loadFixture('expectedSnakeJson.json')
            ]);

            const result = convertFromJson(input, NamingConvention.Snake);

            assert.deepStrictEqual(stripWhiteSpace(result), stripWhiteSpace(expected));
        });
    });

    suite('convertFromYaml', () => {
        test('should convert yaml to kebab case', async () => {
            const [input, expected] = await Promise.all([
                loadFixture('input.yaml'),
                loadFixture('expectedKebabYaml.yaml')
            ]);

            const result = convertFromYaml(input, NamingConvention.Kebab);

            assert.deepStrictEqual(stripNewLines(result), stripNewLines(expected));
        });

        test('should convert yaml to constant case', async () => {
            const [input, expected] = await Promise.all([
                loadFixture('input.yaml'),
                loadFixture('expectedConstantYaml.yaml')
            ]);

            const result = convertFromYaml(input, NamingConvention.Constant);

            assert.deepStrictEqual(stripNewLines(result), stripNewLines(expected));
        });
    });


});
