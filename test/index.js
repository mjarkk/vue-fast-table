import 'jsdom-global/register';
import assert, {strict, strictEqual} from 'assert';
import MinimalTable from '../src';
import {shallowMount} from '@vue/test-utils';

describe('Vue minimal table', () => {
    describe('table', () => {
        it('should have a classname based on props', () => {
            const wrapper = shallowMount(MinimalTable, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                    borderless: true,
                    small: true,
                },
            });
            assert.deepStrictEqual(wrapper.find('table').classes(), [
                'table',
                'b-table',
                'table-borderless',
                'table-sm',
            ]);
        });
    });

    describe('header', () => {
        it('should have a table header element', () => {
            const wrapper = shallowMount(MinimalTable, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('thead').exists());
        });

        describe('table header cells', () => {
            it('should show the field key in the header when there is no label given', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'name');
            });

            it('should show the label in the header', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', label: 'Naam'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').find('th').text(), 'Naam');
            });

            it('should show the amount of headers as there are fields', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}, {key: 'street'}, {key: 'city'}, {key: 'email'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('thead').find('tr').findAll('th').length, 4);
            });
        });
    });

    describe('body', () => {
        it('should have a table body element', () => {
            const wrapper = shallowMount(MinimalTable, {
                propsData: {
                    fields: [{key: 'name'}],
                    items: [{name: 'hoi'}],
                },
            });

            assert(wrapper.find('tbody').exists());
        });

        describe('table data cells', () => {
            it('should show the text of the item belonging to the field key', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'hoi');
            });

            it('should show the formatted text of the item belonging to the field formatter', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'nope'}],
                        items: [{name: 'hoi'}],
                    },
                });

                assert.strictEqual(wrapper.find('tbody').find('tr').find('td').text(), 'nope');
            });

            it("should use a field's tdClass as its classname", () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', tdClass: () => 'rood'}],
                        items: [{name: 'hoi'}],
                    },
                });
                assert(wrapper.find('.rood').exists());
            });

            it('should render scoped slots', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi'}],
                    },
                    scopedSlots: {
                        'cell(name)': `<test-tag>Hoi</test-tag>`,
                    },
                });
                assert(wrapper.find('test-tag').exists());
            });

            it('should emit when a row is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi!'}],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.findAll('td');
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('a row should also emit when a formatter is clicked', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'harry'}],
                        items: [{name: 'hoi!'}],
                    },
                    listeners: {
                        'row-clicked': () => {
                            testResult = true;
                        },
                    },
                });
                const row = wrapper.find('td');
                row.trigger('click');

                assert.strictEqual(testResult, true);
            });

            it('should not emit when a row is clicked without a listener', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'hoi!'}],
                    },
                });
                const row = wrapper.findAll('td');
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });

            it('when no listener is defined, a row should not emit', () => {
                let testResult = false;
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name', formatter: () => 'harry'}],
                        items: [{name: 'hoi!'}],
                    },
                });
                const row = wrapper.find('td');
                row.trigger('click');

                assert.strictEqual(testResult, false);
            });

            it('should sort when a sortBy prop was passed', () => {
                const wrapper = shallowMount(MinimalTable, {
                    propsData: {
                        fields: [{key: 'name'}],
                        items: [{name: 'Xantippe'}, {name: 'Adam'}, {name: 'Harry'}],
                        sortBy: 'name',
                    },
                });
                const tds = wrapper.findAll('td');
                const tableNames = [];
                for (let i = 0; i < tds.length; i++) {
                    tableNames.push(tds.at(i).text());
                }
                const sortedNames = ['Adam', 'Harry', 'Xantippe'];
                assert.deepStrictEqual(sortedNames, tableNames);
            });

            // TODO :: not all sorting lines are covered
        });
    });
});
